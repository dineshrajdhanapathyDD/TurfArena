import { NextResponse } from 'next/server'
import { TABLES, getItem, queryItems, AWS_ENABLED } from '@/lib/aws'
import type { PlayerStatsRecord, MatchRecord } from '@/lib/aws'

// POST /api/ai/insights — Generate AI-powered insights for a player
export async function POST(request: Request) {
  try {
    const { playerId, type } = await request.json()

    if (!playerId) {
      return NextResponse.json({ success: false, error: 'playerId required' }, { status: 400 })
    }

    // Fetch player stats from DynamoDB
    let stats: PlayerStatsRecord[] = []
    if (AWS_ENABLED) {
      stats = await queryItems<PlayerStatsRecord>(
        TABLES.PLAYER_STATS,
        'playerId = :pid',
        { ':pid': playerId }
      )
    } else {
      // Mock stats
      stats = [
        { playerId, sport: 'football', matchesPlayed: 64, wins: 41, losses: 20, draws: 3, goals: 88, assists: 52, mvpAwards: 12, winRate: 64, currentStreak: 4, bestStreak: 7, updatedAt: '' },
      ]
    }

    const footballStats = stats.find(s => s.sport === 'football')
    const totalMatches = stats.reduce((sum, s) => sum + s.matchesPlayed, 0)
    const totalWins = stats.reduce((sum, s) => sum + s.wins, 0)
    const overallWinRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0

    // Generate insights based on type
    let insights: Record<string, unknown> = {}

    switch (type || 'performance') {
      case 'performance':
        insights = {
          type: 'performance',
          summary: `Based on ${totalMatches} matches across ${stats.length} sport(s), your overall win rate is ${overallWinRate}%.`,
          strengths: generateStrengths(footballStats),
          improvements: generateImprovements(footballStats),
          prediction: {
            nextMatchWinProbability: calculateWinProbability(footballStats),
            confidence: 0.72,
            basedOn: `${totalMatches} historical matches`,
          },
          weeklyGoal: `Play ${Math.max(2, 7 - (footballStats?.currentStreak || 0))} more matches this week to maintain your streak.`,
        }
        break

      case 'team_builder':
        insights = {
          type: 'team_builder',
          recommendation: 'Based on your playing style (Striker), pair with a strong midfielder for optimal assists.',
          suggestedFormation: '4-3-3',
          idealTeammates: [
            { role: 'Midfielder', reason: 'High assist rate complements your finishing' },
            { role: 'Defender', reason: 'Solid backline gives you freedom to attack' },
            { role: 'Keeper', reason: 'Reliable saves maintain your win streak' },
          ],
          teamChemistry: 85,
        }
        break

      case 'match_prediction':
        insights = {
          type: 'match_prediction',
          prediction: {
            winProbability: calculateWinProbability(footballStats),
            drawProbability: 0.18,
            lossProbability: 1 - calculateWinProbability(footballStats) - 0.18,
          },
          factors: [
            { factor: 'Current form', impact: 'positive', detail: `${footballStats?.currentStreak || 0} win streak` },
            { factor: 'Goals per match', impact: 'positive', detail: `${((footballStats?.goals || 0) / (footballStats?.matchesPlayed || 1)).toFixed(1)} avg` },
            { factor: 'Historical win rate', impact: 'neutral', detail: `${overallWinRate}%` },
          ],
          confidence: 0.68,
        }
        break

      case 'coach':
        insights = {
          type: 'coach',
          tips: [
            {
              area: 'Finishing',
              tip: `Your conversion rate is ${((footballStats?.goals || 0) / (footballStats?.matchesPlayed || 1)).toFixed(1)} goals/match. Focus on first-touch finishes inside the box.`,
              priority: 'high',
            },
            {
              area: 'Consistency',
              tip: `You have ${footballStats?.currentStreak || 0} wins in a row. Keep warm-up routine consistent to maintain form.`,
              priority: 'medium',
            },
            {
              area: 'Stamina',
              tip: 'Your goal-scoring drops in the last 15 minutes. Add interval training to your routine.',
              priority: 'medium',
            },
          ],
          nextDrill: 'Quick one-touch finishing drill: 20 shots from inside the box, alternate feet.',
          estimatedImprovement: '+12% conversion rate in 2 weeks',
        }
        break

      default:
        insights = { type: 'unknown', message: 'Use type: performance | team_builder | match_prediction | coach' }
    }

    return NextResponse.json({
      success: true,
      data: {
        playerId,
        generatedAt: new Date().toISOString(),
        ...insights,
      },
    })
  } catch (error) {
    console.error('[API Error] POST /api/ai/insights:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

function generateStrengths(stats?: PlayerStatsRecord | null): string[] {
  if (!stats) return ['Consistent player']
  const strengths: string[] = []
  if (stats.winRate > 60) strengths.push(`High win rate (${stats.winRate}%)`)
  if (stats.goals > 50) strengths.push(`Prolific scorer (${stats.goals} goals)`)
  if (stats.assists > 30) strengths.push(`Great playmaker (${stats.assists} assists)`)
  if (stats.mvpAwards > 5) strengths.push(`Regular MVP (${stats.mvpAwards} awards)`)
  if (stats.currentStreak > 3) strengths.push(`Hot form (${stats.currentStreak} win streak)`)
  return strengths.length > 0 ? strengths : ['Improving steadily']
}

function generateImprovements(stats?: PlayerStatsRecord | null): string[] {
  if (!stats) return ['Play more matches to generate insights']
  const improvements: string[] = []
  if (stats.winRate < 60) improvements.push('Improve decision-making in tight matches')
  if (stats.goals / stats.matchesPlayed < 1) improvements.push('Increase shot accuracy and positioning')
  if (stats.currentStreak < 2) improvements.push('Focus on consistency — avoid back-to-back losses')
  if (stats.losses > stats.wins * 0.5) improvements.push('Analyze losses — identify patterns in defeats')
  return improvements.length > 0 ? improvements : ['Maintain current form']
}

function calculateWinProbability(stats?: PlayerStatsRecord | null): number {
  if (!stats) return 0.5
  const baseRate = stats.winRate / 100
  const streakBonus = Math.min(stats.currentStreak * 0.02, 0.1)
  const formFactor = stats.matchesPlayed > 30 ? 0.05 : 0
  return Math.min(Math.round((baseRate + streakBonus + formFactor) * 100) / 100, 0.95)
}
