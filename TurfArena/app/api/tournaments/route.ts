import { NextResponse } from 'next/server'
import { tournaments } from '@/TurfArena/lib/data'

// GET /api/tournaments - List all tournaments
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')
  const city = searchParams.get('city')

  let filtered = [...tournaments]

  if (sport && sport !== 'all') {
    filtered = filtered.filter((t) => t.sport === sport)
  }

  if (city) {
    filtered = filtered.filter((t) => t.city.toLowerCase().includes(city.toLowerCase()))
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  })
}

// POST /api/tournaments - Create a new tournament
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, sport, venue, city, prizePool, entryFee, totalSpots, format, date } = body

    if (!name || !sport || !venue || !format) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, sport, venue, format' },
        { status: 400 }
      )
    }

    // In production, this would write to DynamoDB
    const newTournament = {
      id: `t${Date.now()}`,
      name,
      sport,
      image: '/images/tournament-banner.png',
      date: date || 'TBD',
      venue,
      city: city || 'Unknown',
      prizePool: prizePool || 0,
      entryFee: entryFee || 0,
      teamsJoined: 0,
      totalSpots: totalSpots || 16,
      format,
      startTimestamp: Date.now() + 1000 * 60 * 60 * 72,
    }

    return NextResponse.json({ success: true, data: newTournament }, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
