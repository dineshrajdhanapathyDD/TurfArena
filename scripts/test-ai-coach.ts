import { generateCoachAdvice, generateMatchCommentary, generateTournamentPrediction } from '../lib/aws/bedrock'

async function main() {
  console.log('🏟️ TurfArena AI Coach — Full Test\n')

  // Test 1: Coach advice
  console.log('── AI Coach ──')
  const advice = await generateCoachAdvice({
    name: 'Arjun Mehta',
    sport: 'football',
    matchesPlayed: 64,
    wins: 41,
    goals: 88,
    assists: 52,
    winRate: 64,
    currentStreak: 4,
  })
  console.log(advice || '(no response)')

  // Test 2: Match commentary
  console.log('\n── Live Commentary ──')
  const commentary = await generateMatchCommentary({
    homeTeam: 'Thunder FC',
    awayTeam: 'Strikers United',
    homeScore: 2,
    awayScore: 1,
    minute: 78,
    lastEvent: 'Goal by A. Mehta',
    sport: 'football',
  })
  console.log(commentary || '(no response)')

  // Test 3: Tournament prediction
  console.log('\n── Tournament Prediction ──')
  const prediction = await generateTournamentPrediction({
    tournamentName: 'City Champions League',
    format: '7v7 Knockout',
    teams: ['Thunder FC', 'Strikers United', 'Phoenix XI', 'Royal Kickers'],
    sport: 'football',
  })
  console.log(prediction || '(no response)')

  console.log('\n✅ All AI features working!')
}

main()
