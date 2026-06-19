import { NextResponse } from 'next/server'
import { playerRanks } from '@/lib/data'

// GET /api/players - List players with rankings
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const paginated = playerRanks.slice(offset, offset + limit)

  return NextResponse.json({
    success: true,
    data: paginated,
    total: playerRanks.length,
    limit,
    offset,
  })
}
