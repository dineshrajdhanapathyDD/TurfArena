import { NextResponse } from 'next/server'
import { TABLES, getItem, updateItem, AWS_ENABLED } from '@/lib/aws'
import type { TournamentRecord } from '@/lib/aws'
import { tournaments as mockTournaments } from '@/lib/data'

// GET /api/tournaments/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (AWS_ENABLED) {
    try {
      const item = await getItem<TournamentRecord>(TABLES.TOURNAMENTS, { tournamentId: id })
      if (!item) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      return NextResponse.json({ success: true, data: item })
    } catch (error) {
      console.error('[DynamoDB] GET /api/tournaments/:id:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }
  const t = mockTournaments.find((x) => x.id === id)
  if (!t) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: t })
}

// PATCH /api/tournaments/:id
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const updates = await request.json()
    if (AWS_ENABLED) {
      const parts: string[] = ['#updatedAt = :updatedAt']
      const vals: Record<string, unknown> = { ':updatedAt': new Date().toISOString() }
      const names: Record<string, string> = { '#updatedAt': 'updatedAt' }
      Object.entries(updates).forEach(([k, v]) => {
        if (k === 'tournamentId') return
        parts.push(`#${k} = :${k}`); vals[`:${k}`] = v; names[`#${k}`] = k
      })
      const result = await updateItem(TABLES.TOURNAMENTS, { tournamentId: id }, `SET ${parts.join(', ')}`, vals, names)
      return NextResponse.json({ success: true, data: result })
    }
    const t = mockTournaments.find((x) => x.id === id)
    if (!t) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: { ...t, ...updates } })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid body' }, { status: 400 })
  }
}
