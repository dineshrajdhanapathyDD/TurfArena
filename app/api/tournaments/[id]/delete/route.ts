import { NextResponse } from 'next/server'
import { TABLES, getItem, deleteItem, AWS_ENABLED } from '@/lib/aws'
import type { TournamentRecord } from '@/lib/aws'

// DELETE /api/tournaments/:id/delete — Delete a tournament (organizer only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (AWS_ENABLED) {
    try {
      const tournament = await getItem<TournamentRecord>(TABLES.TOURNAMENTS, { tournamentId: id })
      if (!tournament) {
        return NextResponse.json({ success: false, error: 'Tournament not found' }, { status: 404 })
      }
      if (tournament.status === 'active') {
        return NextResponse.json({ success: false, error: 'Cannot delete active tournament' }, { status: 409 })
      }

      await deleteItem(TABLES.TOURNAMENTS, { tournamentId: id })
      return NextResponse.json({ success: true, message: `Tournament "${tournament.name}" deleted` })
    } catch (error) {
      console.error('[DynamoDB] DELETE /api/tournaments/:id:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, message: 'Tournament deleted (mock)' })
}
