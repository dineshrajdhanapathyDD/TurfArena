import { NextResponse } from 'next/server'
import { TABLES, getItem, updateItem, AWS_ENABLED } from '@/lib/aws'
import type { BookingRecord } from '@/lib/aws'

// POST /api/bookings/:id/cancel — Cancel a booking
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { reason } = await request.json().catch(() => ({ reason: 'User cancelled' }))

    if (AWS_ENABLED) {
      const booking = await getItem<BookingRecord>(TABLES.BOOKINGS, { bookingId: id })
      if (!booking) {
        return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 })
      }
      if (booking.status === 'cancelled') {
        return NextResponse.json({ success: false, error: 'Booking already cancelled' }, { status: 409 })
      }

      const result = await updateItem(
        TABLES.BOOKINGS,
        { bookingId: id },
        'SET #st = :status, cancelledAt = :now, cancelReason = :reason, updatedAt = :now',
        { ':status': 'cancelled', ':now': new Date().toISOString(), ':reason': reason },
        { '#st': 'status' }
      )

      return NextResponse.json({ success: true, data: result, message: 'Booking cancelled successfully' })
    }

    // Mock
    return NextResponse.json({
      success: true,
      data: { bookingId: id, status: 'cancelled', cancelledAt: new Date().toISOString(), reason },
      message: 'Booking cancelled successfully',
    })
  } catch (error) {
    console.error('[API Error] POST /api/bookings/:id/cancel:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
