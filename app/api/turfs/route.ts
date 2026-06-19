import { NextResponse } from 'next/server'
import { turfs } from '@/lib/data'

// GET /api/turfs - List all turfs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')
  const area = searchParams.get('area')
  const maxPrice = searchParams.get('maxPrice')

  let filtered = [...turfs]

  if (sport) {
    filtered = filtered.filter((t) => t.sports.includes(sport as any))
  }

  if (area) {
    filtered = filtered.filter((t) => t.area.toLowerCase().includes(area.toLowerCase()))
  }

  if (maxPrice) {
    filtered = filtered.filter((t) => t.pricePerHour <= parseInt(maxPrice))
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  })
}
