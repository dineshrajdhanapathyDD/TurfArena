import { NextResponse } from 'next/server'
import { tournaments } from '@/lib/data'

// POST /api/tournaments/:id/register - Register a team for a tournament
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const tournament = tournaments.find((t) => t.id === id)

  if (!tournament) {
    return NextResponse.json(
      { success: false, error: 'Tournament not found' },
      { status: 404 }
    )
  }

  if (tournament.teamsJoined >= tournament.totalSpots) {
    return NextResponse.json(
      { success: false, error: 'Tournament is full' },
      { status: 409 }
    )
  }

  try {
    const body = await request.json()
    const { teamName, playerIds, captainId } = body

    if (!teamName || !playerIds || playerIds.length < 5 || !captainId) {
      return NextResponse.json(
        { success: false, error: 'Team name, at least 5 players, and a captain are required' },
        { status: 400 }
      )
    }

    // In production, this would:
    // 1. Verify payment via Razorpay/Stripe
    // 2. Write registration to DynamoDB
    // 3. Trigger EventBridge notification
    const registration = {
      registrationId: `reg_${Date.now()}`,
      tournamentId: id,
      teamName,
      playerIds,
      captainId,
      entryFee: tournament.entryFee,
      status: 'confirmed',
      registeredAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, data: registration }, { status: 201 })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
