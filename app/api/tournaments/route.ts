import { NextResponse } from 'next/server'
import { TABLES, scanItems, putItem, queryItems, AWS_ENABLED } from '@/lib/aws'
import { notifyTournamentCreated } from '@/lib/aws'
import type { TournamentRecord } from '@/lib/aws'
import { tournaments as mockTournaments } from '@/lib/data'

// GET /api/tournaments
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')
  const city = searchParams.get('city')
  const status = searchParams.get('status')

  if (AWS_ENABLED) {
    try {
      let items: TournamentRecord[]
      if (sport && sport !== 'all') {
        items = await queryItems<TournamentRecord>(
          TABLES.TOURNAMENTS, 'sport = :sport', { ':sport': sport },
          { indexName: 'SportStatusIndex' }
        )
      } else {
        const filterParts: string[] = []
        const exprVals: Record<string, unknown> = {}
        const exprNames: Record<string, string> = {}
        if (city) { filterParts.push('city = :city'); exprVals[':city'] = city }
        if (status) { filterParts.push('#st = :status'); exprVals[':status'] = status; exprNames['#st'] = 'status' }
        items = await scanItems<TournamentRecord>(TABLES.TOURNAMENTS, {
          filterExpression: filterParts.length ? filterParts.join(' AND ') : undefined,
          expressionValues: Object.keys(exprVals).length ? exprVals : undefined,
          expressionNames: Object.keys(exprNames).length ? exprNames : undefined,
        })
      }
      return NextResponse.json({ success: true, data: items, total: items.length })
    } catch (error) {
      console.error('[DynamoDB] GET /api/tournaments:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }

  let filtered = [...mockTournaments]
  if (sport && sport !== 'all') filtered = filtered.filter((t) => t.sport === sport)
  if (city) filtered = filtered.filter((t) => t.city.toLowerCase().includes(city.toLowerCase()))
  return NextResponse.json({ success: true, data: filtered, total: filtered.length })
}

// POST /api/tournaments
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, sport, venue, city, prizePool, entryFee, totalSpots, format, date, organizerId } = body
    if (!name || !sport || !venue || !format) {
      return NextResponse.json({ success: false, error: 'name, sport, venue, format required' }, { status: 400 })
    }
    const tournament: TournamentRecord = {
      tournamentId: `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name, sport, image: '/images/tournament-banner.png', date: date || 'TBD',
      venue, city: city || 'Unknown', prizePool: prizePool || 0, entryFee: entryFee || 0,
      teamsJoined: 0, totalSpots: totalSpots || 16, format, status: 'upcoming',
      organizerId: organizerId || 'unknown',
      startTimestamp: Date.now() + 1000 * 60 * 60 * 72,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    if (AWS_ENABLED) {
      await putItem(TABLES.TOURNAMENTS, tournament as unknown as Record<string, unknown>)
      await notifyTournamentCreated(tournament.tournamentId, tournament.name, tournament.organizerId)
    }
    return NextResponse.json({ success: true, data: tournament }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}
