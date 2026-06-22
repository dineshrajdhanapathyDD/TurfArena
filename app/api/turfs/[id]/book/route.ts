import { NextResponse } from 'next/server'
import { TABLES, getItem, putItem, AWS_ENABLED } from '@/lib/aws'
import { notifyBookingConfirmed } from '@/lib/aws'
import type { TurfRecord, BookingRecord } from '@/lib/aws'
import { turfs as mockTurfs } from '@/lib/data'
import {
  lockSlot,
  unlockSlot,
  markSlotBooked,
  isSlotBooked,
  VALKEY_ENABLED,
} from '@/lib/aws/valkey'

// POST /api/turfs/:id/book — Book a slot (with real-time locking via Valkey)
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

    // ─── Step 1: Check Valkey cache for already-booked slots ───
    if (VALKEY_ENABLED) {
      const alreadyBooked = await isSlotBooked(id, date, slot)
      if (alreadyBooked) {
        return NextResponse.json(
          { success: false, error: 'This slot is already booked. Please choose another time.' },
          { status: 409 }
        )
      }
    }

    // ─── Step 2: Acquire lock (prevents double-booking) ───────
    if (VALKEY_ENABLED) {
      const lockAcquired = await lockSlot(id, date, slot)
      if (!lockAcquired) {
        return NextResponse.json(
          { success: false, error: 'Someone else is currently booking this slot. Please try again in a moment.' },
          { status: 423 } // 423 Locked
        )
      }
    }

    try {
      // ─── Step 3: Process booking in DynamoDB ──────────────────
      if (AWS_ENABLED) {
        const turf = await getItem<TurfRecord>(TABLES.TURFS, { turfId: id })
        if (!turf) {
          if (VALKEY_ENABLED) await unlockSlot(id, date, slot)
          return NextResponse.json({ success: false, error: 'Turf not found' }, { status: 404 })
        }

        const booking: BookingRecord = {
          bookingId: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          turfId: id,
          turfName: turf.name,
          userId,
          userName: userName || 'Unknown',
          date,
          slot,
          sport,
          amount: turf.pricePerHour,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        await putItem(TABLES.BOOKINGS, booking as unknown as Record<string, unknown>)

        // ─── Step 4: Mark slot as booked in Valkey ────────────────
        if (VALKEY_ENABLED) {
          await markSlotBooked(id, date, slot, booking.bookingId)
        }

        // ─── Step 5: Fire EventBridge notification ────────────────
        await notifyBookingConfirmed(booking.bookingId, turf.name, userId, date, slot)

        return NextResponse.json({ success: true, data: booking }, { status: 201 })
      }

      // Mock fallback (no AWS)
      const turf = mockTurfs.find((t) => t.id === id)
      if (!turf) {
        if (VALKEY_ENABLED) await unlockSlot(id, date, slot)
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      }

      const mockBooking = {
        bookingId: `bk_${Date.now()}`,
        turfId: id,
        turfName: turf.name,
        date,
        slot,
        sport,
        userId,
        amount: turf.pricePerHour,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }

      if (VALKEY_ENABLED) {
        await markSlotBooked(id, date, slot, mockBooking.bookingId)
      }

      return NextResponse.json({ success: true, data: mockBooking }, { status: 201 })
    } catch (error) {
      // Release lock on any error
      if (VALKEY_ENABLED) await unlockSlot(id, date, slot)
      throw error
    }
  } catch (error) {
    console.error('[API Error] POST /api/turfs/:id/book:', error)
    return NextResponse.json({ success: false, error: 'Booking failed' }, { status: 500 })
  }
}
