import { NextResponse } from 'next/server'
import { turfs } from '@/lib/data'

// GET /api/turfs/:id - Get a single turf
export async function GET(
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

  return NextResponse.json({ success: true, data: turf })
}
