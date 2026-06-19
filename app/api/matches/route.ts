import { NextResponse } from 'next/server'
import { matchEvents } from '@/lib/data'

// GET /api/matches - List matches
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // 'live', 'upcoming', 'completed'
  const tournamentId = searchParams.get('tournamentId')

  // In production: query DynamoDB MATCHES table
  const matches = [
    {
      matchId: 'match1',
      tournamentId: 't1',
      homeTeam: 'Thunder FC',
      awayTeam: 'Strikers United',
      homeScore: 2,
      awayScore: 1,
      status: 'live',
      minute: 82,
      sport: 'football',
      events: matchEvents,
      venue: 'Greenfield Arena',
      startTime: new Date().toISOString(),
    },
    {
      matchId: 'match2',
      tournamentId: 't1',
      homeTeam: 'Phoenix XI',
      awayTeam: 'Royal Kickers',
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      minute: 0,
      sport: 'football',
      events: [],
      venue: 'Greenfield Arena',
      startTime: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    },
    {
      matchId: 'match3',
      tournamentId: 't4',
      homeTeam: 'Knight Riders',
      awayTeam: 'Chennai Warriors',
      homeScore: 145,
      awayScore: 132,
      status: 'completed',
      sport: 'cricket',
      overs: { home: '20.0', away: '18.4' },
      wickets: { home: 6, away: 10 },
      events: [],
      venue: 'Stadium Grounds',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ]

  let filtered = matches

  if (status) {
    filtered = filtered.filter((m) => m.status === status)
  }

  if (tournamentId) {
    filtered = filtered.filter((m) => m.tournamentId === tournamentId)
  }

  return NextResponse.json({ success: true, data: filtered, total: filtered.length })
}

// POST /api/matches - Create a match (organizer action)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tournamentId, homeTeam, awayTeam, sport, venue, startTime } = body

    if (!tournamentId || !homeTeam || !awayTeam || !sport) {
      return NextResponse.json(
        { success: false, error: 'tournamentId, homeTeam, awayTeam, and sport are required' },
        { status: 400 }
      )
    }

    const newMatch = {
      matchId: `match_${Date.now()}`,
      tournamentId,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      minute: 0,
      sport,
      events: [],
      venue: venue || 'TBD',
      startTime: startTime || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, data: newMatch }, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
