import { NextResponse } from 'next/server'
import { turfs } from '@/TurfArena/lib/data'

// POST /api/turfs/:id/book - Book a slot at a turf
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const turf = turfs.find((t) => t.id === id)

  if (!turf) {
    return NextResponse.json(
      { success: false, error: 'Turf not found' },
      { status: 404 }
    )
  }

  try {
    const body = await request.json()
    const { date, slot, sport, userId } = body

    if (!date || !slot || !sport || !userId) {
      return NextResponse.json(
        { success: false, error: 'date, slot, sport, and userId are required' },
        { status: 400 }
      )
    }

    if (!turf.slots.includes(slot)) {
      return NextResponse.json(
        { success: false, error: 'Invalid slot time' },
        { status: 400 }
      )
    }

    // In production: check availability in DynamoDB, process payment
    const booking = {
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

    return NextResponse.json({ success: true, data: booking }, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
