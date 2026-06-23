import { NextResponse } from 'next/server'
import { TABLES, scanItems, queryItems, AWS_ENABLED } from '@/lib/aws'
import type { BookingRecord } from '@/lib/aws'

// GET /api/bookings?turfId=tf1 OR ?userId=p1
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const turfId = searchParams.get('turfId')
  const userId = searchParams.get('userId')

  if (AWS_ENABLED) {
    try {
      let items: BookingRecord[]

      if (turfId) {
        items = await queryItems<BookingRecord>(
          TABLES.BOOKINGS,
          'turfId = :turfId',
          { ':turfId': turfId },
          { indexName: 'TurfIndex' }
        )
      } else if (userId) {
        items = await queryItems<BookingRecord>(
          TABLES.BOOKINGS,
          'userId = :userId',
          { ':userId': userId },
          { indexName: 'UserIndex' }
        )
      } else {
        items = await scanItems<BookingRecord>(TABLES.BOOKINGS)
      }

      // Sort by newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      return NextResponse.json({ success: true, data: items, total: items.length })
    } catch (error) {
      console.error('[DynamoDB] GET /api/bookings:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }

  // Mock fallback
  const mockBookings = [
    { bookingId: 'bk_mock_1', turfId: 'tf1', turfName: 'Greenfield Arena', userId: 'p1', userName: 'Arjun Mehta', date: '2026-06-25', slot: '7:00 PM', sport: 'football', amount: 1200, status: 'confirmed', createdAt: new Date().toISOString() },
    { bookingId: 'bk_mock_2', turfId: 'tf2', turfName: 'Downtown Court', userId: 'p2', userName: 'Sara Khan', date: '2026-06-26', slot: '5:00 PM', sport: 'basketball', amount: 900, status: 'confirmed', createdAt: new Date(Date.now() - 3600000).toISOString() },
  ]

  let filtered = mockBookings
  if (turfId) filtered = filtered.filter(b => b.turfId === turfId)
  if (userId) filtered = filtered.filter(b => b.userId === userId)

  return NextResponse.json({ success: true, data: filtered, total: filtered.length })
}
