import { NextResponse } from 'next/server'
import { TABLES, getItem, AWS_ENABLED } from '@/lib/aws'
import type { TurfRecord } from '@/lib/aws'
import { turfs as mockTurfs } from '@/lib/data'

// GET /api/turfs/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (AWS_ENABLED) {
    try {
      const turf = await getItem<TurfRecord>(TABLES.TURFS, { turfId: id })
      if (!turf) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      return NextResponse.json({ success: true, data: turf })
    } catch (error) {
      console.error('[DynamoDB] GET /api/turfs/:id:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }
  const turf = mockTurfs.find((t) => t.id === id)
  if (!turf) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: turf })
}
