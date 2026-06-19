import { NextResponse } from 'next/server'
import { TABLES, scanItems, getItem, AWS_ENABLED } from '@/lib/aws'
import type { PlayerRecord } from '@/lib/aws'
import { playerRanks } from '@/lib/data'

// GET /api/players
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const city = searchParams.get('city')
  const playerId = searchParams.get('id')

  if (AWS_ENABLED) {
    try {
      if (playerId) {
        const player = await getItem<PlayerRecord>(TABLES.PLAYERS, { playerId })
        if (!player) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
        return NextResponse.json({ success: true, data: player })
      }
      const fp: string[] = []; const ev: Record<string, unknown> = {}
      if (city) { fp.push('city = :city'); ev[':city'] = city }
      const items = await scanItems<PlayerRecord>(TABLES.PLAYERS, {
        filterExpression: fp.length ? fp.join(' AND ') : undefined,
        expressionValues: Object.keys(ev).length ? ev : undefined,
      })
      const paginated = items.slice(offset, offset + limit)
      return NextResponse.json({ success: true, data: paginated, total: items.length, limit, offset })
    } catch (error) {
      console.error('[DynamoDB] GET /api/players:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }

  const paginated = playerRanks.slice(offset, offset + limit)
  return NextResponse.json({ success: true, data: paginated, total: playerRanks.length, limit, offset })
}
