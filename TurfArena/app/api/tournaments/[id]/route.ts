import { NextResponse } from 'next/server'
import { tournaments } from '@/TurfArena/lib/data'

// GET /api/tournaments/:id - Get a single tournament
export async function GET(
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

  return NextResponse.json({ success: true, data: tournament })
}

// PATCH /api/tournaments/:id - Update a tournament
export async function PATCH(
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

  try {
    const updates = await request.json()
    const updated = { ...tournament, ...updates }
    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
