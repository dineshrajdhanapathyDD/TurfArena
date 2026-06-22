import { NextResponse } from 'next/server'
import { TABLES, queryItems, AWS_ENABLED } from '@/lib/aws'
import type { PlayerStatsRecord } from '@/lib/aws'
import {
  BEDROCK_ENABLED,
  generateCoachAdvice,
  generatePerformanceReport,
  generateMatchCommentary,
  generateTournamentPrediction,
  generateTeamStrategy,
} from '@/lib/aws/bedrock'

// POST /api/ai/coach — Amazon Bedrock-powered AI features
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, playerId, playerName, matchData, tournamentData, teamData } = body

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'action required (coach | report | commentary | predict | strategy)' },
        { status: 400 }
      )
    }

    // Fetch player stats if needed
    let stats: PlayerStatsRecord | null = null
    if (playerId && (action === 'coach' || action === 'report')) {
      if (AWS_ENABLED) {
        const allStats = await queryItems<PlayerStatsRecord>(
          TABLES.PLAYER_STATS,
          'playerId = :pid',
          { ':pid': playerId }
        )
        stats = allStats.find(s => s.sport === 'football') || allStats[0] || null
      }

      // Mock stats fallback
      if (!stats) {
        stats = {
          playerId: playerId || 'p1',
          sport: 'football',
          matchesPlayed: 64,
          wins: 41,
          losses: 20,
          draws: 3,
          goals: 88,
          assists: 52,
          mvpAwards: 12,
          winRate: 64,
          currentStreak: 4,
          bestStreak: 7,
          updatedAt: new Date().toISOString(),
        }
      }
    }

    let aiResponse = ''
    let fallbackUsed = false

    switch (action) {
      case 'coach': {
        if (!stats) {
          return NextResponse.json({ success: false, error: 'playerId required for coach' }, { status: 400 })
        }
        aiResponse = await generateCoachAdvice({
          name: playerName || 'Player',
          sport: stats.sport,
          matchesPlayed: stats.matchesPlayed,
          wins: stats.wins,
          goals: stats.goals,
          assists: stats.assists,
          winRate: stats.winRate,
          currentStreak: stats.currentStreak,
        })
        if (!aiResponse) {
          fallbackUsed = true
          aiResponse = `Based on your ${stats.winRate}% win rate:\n1. Focus on positioning in the final third to convert more chances.\n2. Your ${stats.currentStreak}-win streak shows great form — maintain pre-match routine.\n3. With ${stats.assists} assists, keep building link-up play with your midfielders.`
        }
        break
      }

      case 'report': {
        if (!stats) {
          return NextResponse.json({ success: false, error: 'playerId required for report' }, { status: 400 })
        }
        aiResponse = await generatePerformanceReport({
          playerName: playerName || 'Player',
          sport: stats.sport,
          recentMatches: Math.min(stats.matchesPlayed, 7),
          wins: Math.min(stats.wins, 5),
          losses: Math.min(stats.losses, 2),
          goals: Math.min(stats.goals, 8),
          assists: Math.min(stats.assists, 4),
          winRate: stats.winRate,
          streak: stats.currentStreak,
          bestStreak: stats.bestStreak,
        })
        if (!aiResponse) {
          fallbackUsed = true
          aiResponse = `Weekly Report: Strong week with ${stats.winRate}% win rate. Key strength: consistent goal output. Improve: decision-making under pressure. Next week goal: maintain the ${stats.currentStreak}-win streak.`
        }
        break
      }

      case 'commentary': {
        if (!matchData) {
          return NextResponse.json({ success: false, error: 'matchData required for commentary' }, { status: 400 })
        }
        aiResponse = await generateMatchCommentary(matchData)
        if (!aiResponse) {
          fallbackUsed = true
          aiResponse = `What a moment at minute ${matchData.minute}! ${matchData.homeTeam} ${matchData.homeScore > matchData.awayScore ? 'leading' : 'trailing'} ${matchData.homeScore}-${matchData.awayScore} against ${matchData.awayTeam}.`
        }
        break
      }

      case 'predict': {
        if (!tournamentData) {
          return NextResponse.json({ success: false, error: 'tournamentData required for predict' }, { status: 400 })
        }
        aiResponse = await generateTournamentPrediction(tournamentData)
        if (!aiResponse) {
          fallbackUsed = true
          aiResponse = `Favorite: ${tournamentData.teams[0]} — strong recent form. Dark Horse: ${tournamentData.teams[tournamentData.teams.length - 1]} — nothing to lose. Prediction: Expect a thrilling final.`
        }
        break
      }

      case 'strategy': {
        if (!teamData) {
          return NextResponse.json({ success: false, error: 'teamData required for strategy' }, { status: 400 })
        }
        aiResponse = await generateTeamStrategy(teamData)
        if (!aiResponse) {
          fallbackUsed = true
          aiResponse = `1. Press high in the first 15 minutes to force errors.\n2. Use width to stretch their defense with overlapping runs.\n3. Control the midfield tempo — slow build-up, then quick transition.`
        }
        break
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: coach | report | commentary | predict | strategy' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: {
        action,
        response: aiResponse,
        model: fallbackUsed ? 'rule-based-fallback' : 'amazon-nova-micro',
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[API Error] POST /api/ai/coach:', error)
    return NextResponse.json({ success: false, error: 'AI service error' }, { status: 500 })
  }
}
