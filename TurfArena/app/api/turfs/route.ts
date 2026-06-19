import { NextResponse } from 'next/server'
import { TABLES, scanItems, queryItems, AWS_ENABLED } from '@/lib/aws'
import type { TurfRecord } from '@/lib/aws'
import { turfs as mockTurfs } from '@/lib/data'

// GET /api/turfs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')
  const area = searchParams.get('area')
  const maxPrice = searchParams.get('maxPrice')
  const ownerId = searchParams.get('ownerId')

  if (AWS_ENABLED) {
    try {
      let items: TurfRecord[]
      if (ownerId) {
        items = await queryItems<TurfRecord>(TABLES.TURFS, 'ownerId = :o', { ':o': ownerId }, { indexName: 'OwnerIndex' })
      } else {
        const fp: string[] = []; const ev: Record<string, unknown> = {}
        if (sport) { fp.push('contains(sports, :sport)'); ev[':sport'] = sport }
        if (area) { fp.push('contains(area, :area)'); ev[':area'] = area }
        if (maxPrice) { fp.push('pricePerHour <= :mp'); ev[':mp'] = parseInt(maxPrice) }
        items = await scanItems<TurfRecord>(TABLES.TURFS, {
          filterExpression: fp.length ? fp.join(' AND ') : undefined,
          expressionValues: Object.keys(ev).length ? ev : undefined,
        })
      }
      return NextResponse.json({ success: true, data: items, total: items.length })
    } catch (error) {
      console.error('[DynamoDB] GET /api/turfs:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }

  let filtered = [...mockTurfs]
  if (sport) filtered = filtered.filter((t) => t.sports.includes(sport as any))
  if (area) filtered = filtered.filter((t) => t.area.toLowerCase().includes(area.toLowerCase()))
  if (maxPrice) filtered = filtered.filter((t) => t.pricePerHour <= parseInt(maxPrice))
  return NextResponse.json({ success: true, data: filtered, total: filtered.length })
}
