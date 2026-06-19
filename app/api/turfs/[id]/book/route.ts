import { NextResponse } from 'next/server'
import { TABLES, getItem, putItem, AWS_ENABLED } from '@/lib/aws'
import { notifyBookingConfirmed } from '@/lib/aws'
import type { TurfRecord, BookingRecord } from '@/lib/aws'
import { turfs as mockTurfs } from '@/lib/data'

// POST /api/turfs/:id/book
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { date, slot, sport, userId, userName } = await request.json()
    if (!date || !slot || !sport || !userId) {
      return NextResponse.json({ success: false, error: 'date, slot, sport, userId required' }, { status: 400 })
    }

    if (AWS_ENABLED) {
      const turf = await getItem<TurfRecord>(TABLES.TURFS, { turfId: id })
      if (!turf) return NextResponse.json({ success: false, error: 'Turf not found' }, { status: 404 })
      const booking: BookingRecord = {
        bookingId: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        turfId: id, turfName: turf.name, userId, userName: userName || 'Unknown',
        date, slot, sport, amount: turf.pricePerHour, status: 'confirmed',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      }
      await putItem(TABLES.BOOKINGS, booking as unknown as Record<string, unknown>)
      await notifyBookingConfirmed(booking.bookingId, turf.name, userId, date, slot)
      return NextResponse.json({ success: true, data: booking }, { status: 201 })
    }

    const turf = mockTurfs.find((t) => t.id === id)
    if (!turf) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: {
      bookingId: `bk_${Date.now()}`, turfId: id, turfName: turf.name,
      date, slot, sport, userId, amount: turf.pricePerHour, status: 'confirmed',
    } }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 })
  }
}
