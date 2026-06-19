import { NextResponse } from 'next/server'
import { TABLES, scanItems, putItem, queryItems, AWS_ENABLED } from '@/lib/aws'
import type { TeamRecord } from '@/lib/aws'

// GET /api/teams
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const captainId = searchParams.get('captainId')
  const sport = searchParams.get('sport')

  if (AWS_ENABLED) {
    try {
      let items: TeamRecord[]
      if (captainId) {
        items = await queryItems<TeamRecord>(TABLES.TEAMS, 'captainId = :c', { ':c': captainId }, { indexName: 'CaptainIndex' })
      } else {
        const fp: string[] = []; const ev: Record<string, unknown> = {}
        if (sport) { fp.push('sport = :sport'); ev[':sport'] = sport }
        items = await scanItems<TeamRecord>(TABLES.TEAMS, {
          filterExpression: fp.length ? fp.join(' AND ') : undefined,
          expressionValues: Object.keys(ev).length ? ev : undefined,
        })
      }
      return NextResponse.json({ success: true, data: items, total: items.length })
    } catch (error) {
      console.error('[DynamoDB] GET /api/teams:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }

  // Mock fallback
  const teams = [
    { teamId: 'team1', teamName: 'Thunder FC', captainId: 'p1', sport: 'football', city: 'Bengaluru', members: 6, wins: 41, losses: 23, ranking: 1 },
    { teamId: 'team2', teamName: 'Strikers United', captainId: 'p4', sport: 'football', city: 'Mumbai', members: 8, wins: 38, losses: 26, ranking: 2 },
    { teamId: 'team3', teamName: 'Phoenix XI', captainId: 'p6', sport: 'football', city: 'Pune', members: 9, wins: 35, losses: 29, ranking: 3 },
  ]
  return NextResponse.json({ success: true, data: teams, total: teams.length })
}

// POST /api/teams
export async function POST(request: Request) {
  try {
    const { teamName, captainId, sport, city, members } = await request.json()
    if (!teamName || !captainId || !sport) {
      return NextResponse.json({ success: false, error: 'teamName, captainId, sport required' }, { status: 400 })
    }
    const team: TeamRecord = {
      teamId: `team_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      teamName, captainId, sport, city: city || 'Unknown',
      members: members || [captainId], wins: 0, losses: 0, ranking: null,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    if (AWS_ENABLED) {
      await putItem(TABLES.TEAMS, team as unknown as Record<string, unknown>)
    }
    return NextResponse.json({ success: true, data: team }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 })
  }
}
