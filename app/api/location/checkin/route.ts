import { NextResponse } from 'next/server'
import { TABLES, getItem, putItem, AWS_ENABLED } from '@/lib/aws'
import { publishEvent } from '@/lib/aws'

// POST /api/location/checkin — Player check-in at a venue
// Verifies the player is within 200m of the turf/venue
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, matchId, lat, lng } = body

    if (!userId || !lat || !lng) {
      return NextResponse.json(
        { success: false, error: 'userId, lat, and lng are required' },
        { status: 400 }
      )
    }

    // Venue coordinates (in production, fetch from match/turf record)
    const venueCoordinates: Record<string, { lat: number; lng: number; name: string }> = {
      match1: { lat: 12.9352, lng: 77.6245, name: 'Greenfield Arena' },
      match2: { lat: 12.9352, lng: 77.6245, name: 'Greenfield Arena' },
      match3: { lat: 12.9698, lng: 77.7499, name: 'Stadium Grounds' },
    }

    const venue = matchId ? venueCoordinates[matchId] : null
    let isAtVenue = false
    let distanceMeters = 0

    if (venue) {
      // Calculate distance in meters
      const R = 6371000 // Earth's radius in meters
      const dLat = ((venue.lat - lat) * Math.PI) / 180
      const dLon = ((venue.lng - lng) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((venue.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      distanceMeters = Math.round(R * c)

      // Player must be within 200 meters of venue
      isAtVenue = distanceMeters <= 200
    }

    const checkin = {
      checkinId: `chk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      matchId: matchId || null,
      latitude: lat,
      longitude: lng,
      isAtVenue,
      distanceMeters,
      venueName: venue?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    }

    if (AWS_ENABLED) {
      // Store checkin record
      await putItem(TABLES.BOOKINGS, {
        bookingId: checkin.checkinId, // reuse Bookings table for checkins
        turfId: matchId || 'general',
        userId,
        date: new Date().toISOString().split('T')[0],
        slot: 'checkin',
        sport: 'checkin',
        amount: 0,
        status: isAtVenue ? 'verified' : 'unverified',
        latitude: lat,
        longitude: lng,
        distanceMeters,
        createdAt: checkin.timestamp,
        updatedAt: checkin.timestamp,
        userName: '',
        turfName: venue?.name || '',
      })

      // Fire event
      await publishEvent({
        type: 'player.achievement',
        source: 'location',
        userId,
        detail: {
          action: 'checkin',
          matchId,
          isAtVenue,
          distanceMeters,
          venueName: venue?.name,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: checkin,
      message: isAtVenue
        ? `Checked in at ${venue?.name}. You are ${distanceMeters}m from the venue.`
        : `You are ${distanceMeters}m away. Please move within 200m of the venue to check in.`,
    }, { status: 201 })
  } catch (error) {
    console.error('[API Error] POST /api/location/checkin:', error)
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}
