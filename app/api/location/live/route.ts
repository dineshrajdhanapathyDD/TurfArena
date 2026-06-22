import { NextResponse } from 'next/server'
import { TABLES, putItem, queryItems, AWS_ENABLED } from '@/lib/aws'

// POST /api/location/live — Update player's live location (during match)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, matchId, lat, lng, accuracy } = body

    if (!userId || !lat || !lng) {
      return NextResponse.json(
        { success: false, error: 'userId, lat, and lng are required' },
        { status: 400 }
      )
    }

    const locationUpdate = {
      locationId: `loc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      matchId: matchId || null,
      latitude: lat,
      longitude: lng,
      accuracy: accuracy || null,
      timestamp: new Date().toISOString(),
    }

    if (AWS_ENABLED) {
      // Store in Leaderboards table (reusing for location tracking with partitionKey)
      await putItem(TABLES.LEADERBOARDS, {
        partitionKey: `location#${matchId || 'general'}`,
        playerId: userId,
        playerName: '',
        avatar: '',
        points: 0,
        matches: 0,
        badge: 'active',
        change: 0,
        latitude: lat,
        longitude: lng,
        accuracy,
        updatedAt: locationUpdate.timestamp,
      })
    }

    return NextResponse.json({ success: true, data: locationUpdate })
  } catch (error) {
    console.error('[API Error] POST /api/location/live:', error)
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}

// GET /api/location/live?matchId=match1 — Get all live player locations for a match
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const matchId = searchParams.get('matchId')

  if (!matchId) {
    return NextResponse.json(
      { success: false, error: 'matchId query parameter is required' },
      { status: 400 }
    )
  }

  if (AWS_ENABLED) {
    try {
      const locations = await queryItems(
        TABLES.LEADERBOARDS,
        'partitionKey = :pk',
        { ':pk': `location#${matchId}` }
      )

      return NextResponse.json({ success: true, data: locations, total: locations.length })
    } catch (error) {
      console.error('[DynamoDB] GET /api/location/live:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }

  // Mock fallback
  const mockLocations = [
    { playerId: 'p1', playerName: 'Arjun Mehta', latitude: 12.9355, longitude: 77.6248, updatedAt: new Date().toISOString() },
    { playerId: 'p2', playerName: 'Sara Khan', latitude: 12.9350, longitude: 77.6242, updatedAt: new Date().toISOString() },
    { playerId: 'p3', playerName: 'Rohan Das', latitude: 12.9348, longitude: 77.6250, updatedAt: new Date().toISOString() },
  ]

  return NextResponse.json({ success: true, data: mockLocations, total: mockLocations.length })
}
