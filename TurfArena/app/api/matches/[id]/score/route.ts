import { NextResponse } from 'next/server'
import { TABLES, getItem, updateItem } from '@/lib/aws'
import { notifyScoreUpdated, AWS_ENABLED } from '@/lib/aws'
import type { MatchRecord, MatchEvent } from '@/lib/aws'

// PATCH /api/matches/:id/score - Update match score
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const { homeScore, awayScore, event, minute, status } = body

    if (AWS_ENABLED) {
      const match = await getItem<MatchRecord>(TABLES.MATCHES, { matchId: id })
      if (!match) {
        return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 })
      }

      const updateParts = ['updatedAt = :now']
      const expressionValues: Record<string, unknown> = {
        ':now': new Date().toISOString(),
      }

      if (homeScore !== undefined) {
        updateParts.push('homeScore = :homeScore')
        expressionValues[':homeScore'] = homeScore
      }
      if (awayScore !== undefined) {
        updateParts.push('awayScore = :awayScore')
        expressionValues[':awayScore'] = awayScore
      }
      if (minute !== undefined) {
        updateParts.push('minute = :minute')
        expressionValues[':minute'] = minute
      }
      if (status) {
        updateParts.push('#st = :status')
        expressionValues[':status'] = status
      }
      if (event) {
        updateParts.push('events = list_append(events, :newEvent)')
        expressionValues[':newEvent'] = [event]
      }

      const result = await updateItem(
        TABLES.MATCHES,
        { matchId: id },
        `SET ${updateParts.join(', ')}`,
        expressionValues,
        status ? { '#st': 'status' } : undefined
      )

      // Fire real-time notification
      await notifyScoreUpdated(
        id,
        homeScore ?? match.homeScore,
        awayScore ?? match.awayScore,
        event?.type || 'score_update'
      )

      return NextResponse.json({ success: true, data: result })
    }

    // Mock fallback
    return NextResponse.json({
      success: true,
      data: { matchId: id, homeScore, awayScore, event, minute, status, updatedAt: new Date().toISOString() },
    })
  } catch (error) {
    console.error('[API Error] PATCH /api/matches/:id/score:', error)
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}
