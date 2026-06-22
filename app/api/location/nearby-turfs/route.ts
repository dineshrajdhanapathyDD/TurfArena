import { NextResponse } from 'next/server'
import { TABLES, scanItems, AWS_ENABLED } from '@/lib/aws'
import type { TurfRecord } from '@/lib/aws'
import { turfs as mockTurfs } from '@/lib/data'

// Haversine formula to calculate distance between two GPS coordinates
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Mock coordinates for turfs (in production, stored in DynamoDB)
const turfCoordinates: Record<string, { lat: number; lng: number }> = {
  tf1: { lat: 12.9352, lng: 77.6245 }, // Koramangala
  tf2: { lat: 12.9716, lng: 77.6412 }, // Indiranagar
  tf3: { lat: 12.9081, lng: 77.6476 }, // HSR Layout
  tf4: { lat: 12.9698, lng: 77.7499 }, // Whitefield
}

// GET /api/location/nearby-turfs?lat=12.93&lng=77.62&radius=5
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lng = parseFloat(searchParams.get('lng') || '0')
  const radius = parseFloat(searchParams.get('radius') || '10') // default 10km
  const sport = searchParams.get('sport')

  if (!lat || !lng) {
    return NextResponse.json(
      { success: false, error: 'lat and lng query parameters are required' },
      { status: 400 }
    )
  }

  if (AWS_ENABLED) {
    try {
      const filterParts: string[] = []
      const expressionValues: Record<string, unknown> = {}

      if (sport) {
        filterParts.push('contains(sports, :sport)')
        expressionValues[':sport'] = sport
      }

      const allTurfs = await scanItems<TurfRecord & { latitude?: number; longitude?: number }>(
        TABLES.TURFS,
        {
          filterExpression: filterParts.length ? filterParts.join(' AND ') : undefined,
          expressionValues: Object.keys(expressionValues).length ? expressionValues : undefined,
        }
      )

      const nearby = allTurfs
        .map((turf) => {
          const turfLat = turf.latitude || turfCoordinates[turf.turfId]?.lat || 0
          const turfLng = turf.longitude || turfCoordinates[turf.turfId]?.lng || 0
          const distance = getDistanceKm(lat, lng, turfLat, turfLng)
          return { ...turf, distance: Math.round(distance * 10) / 10, latitude: turfLat, longitude: turfLng }
        })
        .filter((t) => t.distance <= radius)
        .sort((a, b) => a.distance - b.distance)

      return NextResponse.json({ success: true, data: nearby, total: nearby.length, radius })
    } catch (error) {
      console.error('[DynamoDB] GET /api/location/nearby-turfs:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }

  // Mock fallback
  const nearby = mockTurfs
    .map((turf) => {
      const coords = turfCoordinates[turf.id]
      const distance = coords ? getDistanceKm(lat, lng, coords.lat, coords.lng) : turf.distanceKm
      return {
        ...turf,
        distance: Math.round(distance * 10) / 10,
        latitude: coords?.lat || 0,
        longitude: coords?.lng || 0,
      }
    })
    .filter((t) => t.distance <= radius)
    .sort((a, b) => a.distance - b.distance)

  return NextResponse.json({ success: true, data: nearby, total: nearby.length, radius })
}
