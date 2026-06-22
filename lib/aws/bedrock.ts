/**
 * Amazon Bedrock AI Integration for TurfArena
 *
 * Uses Amazon Nova Micro (us.amazon.nova-micro-v1:0) for:
 * - AI Performance Coach (personalized training tips)
 * - Match Commentary (real-time AI commentary)
 * - Tournament Predictions (win probability analysis)
 * - Player Reports (weekly AI-generated performance summaries)
 *
 * Fallback: If Bedrock is unavailable, returns rule-based insights.
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime'

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  }),
})

// Model ID — Amazon Nova Micro (fast, free tier)
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.amazon.nova-micro-v1:0'

export const BEDROCK_ENABLED = !!process.env.AWS_REGION

/**
 * Call Amazon Bedrock with a prompt and get text response.
 */
export async function invokeBedrockModel(prompt: string, maxTokens = 500): Promise<string> {
  try {
    const payload = {
      messages: [{ role: 'user', content: [{ text: prompt }] }],
      inferenceConfig: {
        maxTokens,
        temperature: 0.7,
        topP: 0.9,
      },
    }

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    })

    const response = await bedrockClient.send(command)
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))

    // Nova model response format
    const text = responseBody?.output?.message?.content?.[0]?.text
      || responseBody?.results?.[0]?.outputText
      || 'Unable to generate response.'

    return text
  } catch (error: any) {
    console.error('[Bedrock] Error:', error.message)
    return '' // Return empty string — caller handles fallback
  }
}

// ─── AI Coach ────────────────────────────────────────────────────

export async function generateCoachAdvice(playerStats: {
  name: string
  sport: string
  matchesPlayed: number
  wins: number
  goals: number
  assists: number
  winRate: number
  currentStreak: number
}): Promise<string> {
  const prompt = `You are an expert sports performance coach for ${playerStats.sport}. 
Analyze this player's stats and give 3 specific, actionable training tips in a friendly tone.

Player: ${playerStats.name}
Sport: ${playerStats.sport}
Matches Played: ${playerStats.matchesPlayed}
Wins: ${playerStats.wins} (Win Rate: ${playerStats.winRate}%)
Goals: ${playerStats.goals}
Assists: ${playerStats.assists}
Current Streak: ${playerStats.currentStreak} wins

Give exactly 3 tips. Each tip should be 1-2 sentences. Focus on what they can improve based on their numbers. Be encouraging but specific.`

  return invokeBedrockModel(prompt, 300)
}

// ─── Match Commentary ────────────────────────────────────────────

export async function generateMatchCommentary(matchData: {
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  minute: number
  lastEvent?: string
  sport: string
}): Promise<string> {
  const prompt = `You are a live sports commentator for a ${matchData.sport} match.
Generate exciting 2-sentence commentary for the current moment.

Match: ${matchData.homeTeam} vs ${matchData.awayTeam}
Score: ${matchData.homeScore} - ${matchData.awayScore}
Minute: ${matchData.minute}'
Last Event: ${matchData.lastEvent || 'Normal play'}

Be energetic, brief, and capture the excitement. Use present tense.`

  return invokeBedrockModel(prompt, 100)
}

// ─── Performance Report ──────────────────────────────────────────

export async function generatePerformanceReport(data: {
  playerName: string
  sport: string
  recentMatches: number
  wins: number
  losses: number
  goals: number
  assists: number
  winRate: number
  streak: number
  bestStreak: number
}): Promise<string> {
  const prompt = `Generate a brief weekly performance report for a ${data.sport} player.
Write it like a professional sports analyst — concise, data-driven, motivating.

Player: ${data.playerName}
This Week: ${data.recentMatches} matches (${data.wins}W / ${data.losses}L)
Goals: ${data.goals} | Assists: ${data.assists}
Win Rate: ${data.winRate}%
Current Streak: ${data.streak} wins (Best ever: ${data.bestStreak})

Format: 
- Summary (1 sentence)
- Key Strength (1 sentence)  
- Area to Improve (1 sentence)
- Goal for Next Week (1 sentence)

Keep it under 100 words total.`

  return invokeBedrockModel(prompt, 200)
}

// ─── Tournament Prediction ───────────────────────────────────────

export async function generateTournamentPrediction(data: {
  tournamentName: string
  format: string
  teams: string[]
  sport: string
}): Promise<string> {
  const prompt = `You are a sports analyst. Predict the outcome of this ${data.sport} tournament.
Give a brief, exciting prediction with a favorite team and dark horse.

Tournament: ${data.tournamentName}
Format: ${data.format}
Teams: ${data.teams.join(', ')}

Format your response as:
- Favorite: [team name] — [1 sentence why]
- Dark Horse: [team name] — [1 sentence why]
- Prediction: [1 sentence final prediction]

Keep it under 80 words.`

  return invokeBedrockModel(prompt, 150)
}

// ─── Team Strategy ───────────────────────────────────────────────

export async function generateTeamStrategy(data: {
  teamName: string
  sport: string
  formation: string
  strengths: string[]
  opponentName: string
}): Promise<string> {
  const prompt = `You are a tactical analyst for ${data.sport}. 
Suggest a game strategy for the upcoming match.

Team: ${data.teamName}
Formation: ${data.formation}
Strengths: ${data.strengths.join(', ')}
Opponent: ${data.opponentName}

Give 3 tactical tips in 1 sentence each. Be specific to the sport and formation.`

  return invokeBedrockModel(prompt, 200)
}
