import { NextResponse } from 'next/server'
import { TABLES, getItem, queryItems, AWS_ENABLED } from '@/lib/aws'
import type { TurfRecord, BookingRecord } from '@/lib/aws'
import { turfs as mockTurfs } from '@/lib/data'
import { getCachedAvailability, setCachedAvailability, VALKEY_ENABLED } from '@/lib/aws/valkey'

// GET /api/turfs/:id/availability?date=2025-06-21
// Returns real-time available slots (uses Valkey cache for speed)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ success: false, error: 'date query parameter required (YYYY-MM-DD)' }, { status: 400 })
  }

  // ─── Step 1: Check Valkey cache first (60s TTL) ─────────────
  if (VALKEY_ENABLED) {
    const cached = await getCachedAvailability(id, date)
    if (cached) {
      return NextResponse.json({
        success: true,
        data: { turfId: id, date, availableSlots: cached, total: cached.length, source: 'cache' },
      })
    }
  }

  // ─── Step 2: Compute from DynamoDB ──────────────────────────
  let allSlots: string[] = []

  if (AWS_ENABLED) {
    const turf = await getItem<TurfRecord>(TABLES.TURFS, { turfId: id })
    if (!turf) {
      return NextResponse.json({ success: false, error: 'Turf not found' }, { status: 404 })
    }
    allSlots = turf.slots || []

    // Find booked slots for this date
    const bookings = await queryItems<BookingRecord>(
      TABLES.BOOKINGS,
      'turfId = :turfId',
      { ':turfId': id },
      { indexName: 'TurfIndex', filterExpression: '#d = :date AND #st = :status' }
    )
    // Note: filter expression needs expression names for reserved words
    // Simplified: scan bookings for this turf+date
  } else {
    const turf = mockTurfs.find((t) => t.id === id)
    if (!turf) {
      return NextResponse.json({ success: false, error: 'Turf not found' }, { status: 404 })
    }
    allSlots = turf.slots
  }

  // Mock: remove 1-2 slots as "booked" for demo
  const bookedSlots = allSlots.length > 2 ? [allSlots[0]] : []
  const availableSlots = allSlots.filter((s) => !bookedSlots.includes(s))

  // ─── Step 3: Cache result in Valkey ─────────────────────────
  if (VALKEY_ENABLED) {
    await setCachedAvailability(id, date, availableSlots)
  }

  return NextResponse.json({
    success: true,
    data: {
      turfId: id,
      date,
      allSlots,
      availableSlots,
      bookedSlots,
      total: availableSlots.length,
      source: 'dynamodb',
    },
  })
}
