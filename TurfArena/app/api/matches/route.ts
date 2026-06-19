import { NextResponse } from 'next/server'
import { TABLES, scanItems, putItem, queryItems, AWS_ENABLED } from '@/lib/aws'
import { notifyMatchStarted } from '@/lib/aws'
import type { MatchRecord } from '@/lib/aws'
import { matchEvents } from '@/lib/data'

// GET /api/matches
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const tournamentId = searchParams.get('tournamentId')

  if (AWS_ENABLED) {
    try {
      let items: MatchRecord[]
      if (tournamentId) {
        const ev: Record<string, unknown> = { ':tid': tournamentId }
        let kc = 'tournamentId = :tid'
        if (status) { kc += ' AND #st = :status'; ev[':status'] = status }
        items = await queryItems<MatchRecord>(TABLES.MATCHES, kc, ev, { indexName: 'TournamentIndex' })
      } else {
        const fp: string[] = []; const ev: Record<string, unknown> = {}; const en: Record<string, string> = {}
        if (status) { fp.push('#st = :status'); ev[':status'] = status; en['#st'] = 'status' }
        items = await scanItems<MatchRecord>(TABLES.MATCHES, {
          filterExpression: fp.length ? fp.join(' AND ') : undefined,
          expressionValues: Object.keys(ev).length ? ev : undefined,
          expressionNames: Object.keys(en).length ? en : undefined,
        })
      }
      return NextResponse.json({ success: true, data: items, total: items.length })
    } catch (error) {
      console.error('[DynamoDB] GET /api/matches:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }

  // Mock fallback
  const mock = [
    { matchId: 'match1', tournamentId: 't1', homeTeam: 'Thunder FC', awayTeam: 'Strikers United', homeScore: 2, awayScore: 1, status: 'live', sport: 'football', events: matchEvents, venue: 'Greenfield Arena', startTime: new Date().toISOString() },
    { matchId: 'match2', tournamentId: 't1', homeTeam: 'Phoenix XI', awayTeam: 'Royal Kickers', homeScore: 0, awayScore: 0, status: 'upcoming', sport: 'football', events: [], venue: 'Greenfield Arena', startTime: new Date(Date.now() + 5400000).toISOString() },
  ]
  let filtered = mock
  if (status) filtered = filtered.filter((m) => m.status === status)
  if (tournamentId) filtered = filtered.filter((m) => m.tournamentId === tournamentId)
  return NextResponse.json({ success: true, data: filtered, total: filtered.length })
}

// POST /api/matches
export async function POST(request: Request) {
  try {
    const { tournamentId, homeTeam, awayTeam, homeTeamId, awayTeamId, sport, venue, startTime } = await request.json()
    if (!tournamentId || !homeTeam || !awayTeam || !sport) {
      return NextResponse.json({ success: false, error: 'tournamentId, homeTeam, awayTeam, sport required' }, { status: 400 })
    }
    const match: MatchRecord = {
      matchId: `match_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      tournamentId, homeTeam, awayTeam, homeTeamId: homeTeamId || '', awayTeamId: awayTeamId || '',
      homeScore: 0, awayScore: 0, status: 'upcoming', sport, minute: 0, events: [],
      venue: venue || 'TBD', startTime: startTime || new Date().toISOString(),
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    if (AWS_ENABLED) {
      await putItem(TABLES.MATCHES, match as unknown as Record<string, unknown>)
      await notifyMatchStarted(match.matchId, tournamentId, homeTeam, awayTeam)
    }
    return NextResponse.json({ success: true, data: match }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 })
  }
}
