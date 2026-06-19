import { NextResponse } from 'next/server'
import { TABLES, queryItems, AWS_ENABLED } from '@/lib/aws'
import type { PlayerStatsRecord } from '@/lib/aws'

// GET /api/players/:id/stats - Get player stats across sports
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')

  if (AWS_ENABLED) {
    try {
      let keyCondition = 'playerId = :playerId'
      const expressionValues: Record<string, unknown> = { ':playerId': id }

      if (sport) {
        keyCondition += ' AND sport = :sport'
        expressionValues[':sport'] = sport
      }

      const stats = await queryItems<PlayerStatsRecord>(
        TABLES.PLAYER_STATS,
        keyCondition,
        expressionValues
      )

      return NextResponse.json({ success: true, data: stats })
    } catch (error) {
      console.error('[DynamoDB Error] GET /api/players/:id/stats:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }
  }

  // Mock fallback
  const mockStats = [
    { playerId: id, sport: 'football', matchesPlayed: 47, wins: 32, losses: 12, draws: 3, goals: 88, assists: 52, mvpAwards: 12, winRate: 68, currentStreak: 4, bestStreak: 7 },
    { playerId: id, sport: 'cricket', matchesPlayed: 10, wins: 7, losses: 3, draws: 0, goals: 0, assists: 0, mvpAwards: 2, winRate: 70, currentStreak: 2, bestStreak: 4 },
    { playerId: id, sport: 'basketball', matchesPlayed: 5, wins: 3, losses: 2, draws: 0, goals: 0, assists: 0, mvpAwards: 0, winRate: 60, currentStreak: 1, bestStreak: 2 },
  ]

  return NextResponse.json({ success: true, data: sport ? mockStats.filter(s => s.sport === sport) : mockStats })
}
