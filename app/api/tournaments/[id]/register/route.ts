import { NextResponse } from 'next/server'
import { TABLES, getItem, putItem, updateItem, AWS_ENABLED } from '@/lib/aws'
import { notifyTeamRegistered } from '@/lib/aws'
import type { TournamentRecord, RegistrationRecord } from '@/lib/aws'
import { tournaments as mockTournaments } from '@/lib/data'

// POST /api/tournaments/:id/register
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { teamName, playerIds, captainId, paymentId } = await request.json()
    if (!teamName || !playerIds || playerIds.length < 5 || !captainId) {
      return NextResponse.json({ success: false, error: 'Team name, 5+ players, captain required' }, { status: 400 })
    }

    if (AWS_ENABLED) {
      const tournament = await getItem<TournamentRecord>(TABLES.TOURNAMENTS, { tournamentId: id })
      if (!tournament) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      if (tournament.teamsJoined >= tournament.totalSpots) {
        return NextResponse.json({ success: false, error: 'Tournament full' }, { status: 409 })
      }
      const reg: RegistrationRecord = {
        registrationId: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        tournamentId: id, teamId: `team_${Date.now()}`, teamName, captainId, playerIds,
        entryFee: tournament.entryFee, status: 'confirmed', paymentId, registeredAt: new Date().toISOString(),
      }
      await putItem(TABLES.REGISTRATIONS, reg as unknown as Record<string, unknown>)
      await updateItem(TABLES.TOURNAMENTS, { tournamentId: id },
        'SET teamsJoined = teamsJoined + :inc, updatedAt = :now',
        { ':inc': 1, ':now': new Date().toISOString() })
      await notifyTeamRegistered(id, reg.teamId, teamName, captainId)
      return NextResponse.json({ success: true, data: reg }, { status: 201 })
    }

    const t = mockTournaments.find((x) => x.id === id)
    if (!t) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    if (t.teamsJoined >= t.totalSpots) return NextResponse.json({ success: false, error: 'Full' }, { status: 409 })
    return NextResponse.json({ success: true, data: { registrationId: `reg_${Date.now()}`, tournamentId: id, teamName, status: 'confirmed' } }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 })
  }
}
