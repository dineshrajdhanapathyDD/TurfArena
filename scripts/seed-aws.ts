/**
 * TurfArena AWS Data Seeder
 * Populates DynamoDB tables with initial data for development/demo.
 *
 * Usage:
 *   npx tsx scripts/seed-aws.ts
 *
 * Prerequisites:
 *   - Run `npx tsx scripts/setup-aws.ts` first to create tables
 *   - AWS credentials configured via env vars or CLI profile
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const REGION = process.env.AWS_REGION || 'us-east-1'

const client = new DynamoDBClient({ region: REGION })
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
})

async function put(table: string, item: Record<string, unknown>) {
  await docClient.send(new PutCommand({ TableName: table, Item: item }))
}

// ─── Players ────────────────────────────────────────────────────

const players = [
  { playerId: 'p1', name: 'Arjun Mehta', email: 'arjun@turf.com', city: 'Bengaluru', ranking: 1, avatar: '/images/player-1.png', role: 'captain', credits: 8000 },
  { playerId: 'p2', name: 'Sara Khan', email: 'sara@turf.com', city: 'Bengaluru', ranking: 2, avatar: '/images/player-2.png', role: 'customer', credits: 6500 },
  { playerId: 'p3', name: 'Rohan Das', email: 'rohan@turf.com', city: 'Bengaluru', ranking: 3, avatar: '/images/player-3.png', role: 'customer', credits: 5200 },
  { playerId: 'p4', name: 'Vikram Rao', email: 'vikram@turf.com', city: 'Mumbai', ranking: 4, avatar: '/images/player-1.png', role: 'customer', credits: 4800 },
  { playerId: 'p5', name: 'Neha Iyer', email: 'neha@turf.com', city: 'Pune', ranking: 5, avatar: '/images/player-2.png', role: 'customer', credits: 4200 },
  { playerId: 'p6', name: 'Karan Singh', email: 'karan@turf.com', city: 'Bengaluru', ranking: 6, avatar: '/images/player-3.png', role: 'customer', credits: 3900 },
  { playerId: 'u2', name: 'Priya Patel', email: 'organizer@turf.com', city: 'Bengaluru', ranking: 10, avatar: '/images/player-2.png', role: 'organizer', credits: 15000 },
  { playerId: 'u3', name: 'Rajesh Kumar', email: 'owner@turf.com', city: 'Bengaluru', ranking: 15, avatar: '/images/player-3.png', role: 'owner', credits: 25000 },
]

// ─── Teams ──────────────────────────────────────────────────────

const teams = [
  { teamId: 'team1', teamName: 'Thunder FC', captainId: 'p1', sport: 'football', city: 'Bengaluru', members: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'], wins: 41, losses: 23, ranking: 1 },
  { teamId: 'team2', teamName: 'Strikers United', captainId: 'p4', sport: 'football', city: 'Mumbai', members: ['p4', 'p5'], wins: 38, losses: 26, ranking: 2 },
  { teamId: 'team3', teamName: 'Phoenix XI', captainId: 'p6', sport: 'football', city: 'Pune', members: ['p6', 'p5', 'p3'], wins: 35, losses: 29, ranking: 3 },
  { teamId: 'team4', teamName: 'Royal Kickers', captainId: 'p2', sport: 'football', city: 'Bengaluru', members: ['p2', 'p3'], wins: 30, losses: 34, ranking: 4 },
]

// ─── Tournaments ────────────────────────────────────────────────

const tournaments = [
  {
    tournamentId: 't1', name: 'City Champions League', sport: 'football',
    image: '/images/tournament-banner.png', date: 'Sat, 21 Jun · 6:00 PM',
    venue: 'Greenfield Arena', city: 'Bengaluru', prizePool: 50000,
    entryFee: 1500, teamsJoined: 14, totalSpots: 16, format: '7v7 · Knockout',
    status: 'active', organizerId: 'u2', startTimestamp: Date.now() + 1000 * 60 * 60 * 52,
  },
  {
    tournamentId: 't2', name: 'Weekend Premier Cup', sport: 'football',
    image: '/images/turf-football-night.png', date: 'Sun, 22 Jun · 4:00 PM',
    venue: 'Turf Park Central', city: 'Bengaluru', prizePool: 25000,
    entryFee: 1000, teamsJoined: 8, totalSpots: 12, format: '5v5 · League',
    status: 'upcoming', organizerId: 'u2', startTimestamp: Date.now() + 1000 * 60 * 60 * 78,
  },
  {
    tournamentId: 't3', name: 'Hoops Showdown', sport: 'basketball',
    image: '/images/basketball-court.png', date: 'Fri, 27 Jun · 7:00 PM',
    venue: 'Downtown Court', city: 'Mumbai', prizePool: 30000,
    entryFee: 1200, teamsJoined: 6, totalSpots: 8, format: '3v3 · Knockout',
    status: 'upcoming', organizerId: 'u2', startTimestamp: Date.now() + 1000 * 60 * 60 * 120,
  },
  {
    tournamentId: 't4', name: 'Box Cricket Blast', sport: 'cricket',
    image: '/images/cricket-ground.png', date: 'Sat, 28 Jun · 5:00 PM',
    venue: 'Stadium Grounds', city: 'Pune', prizePool: 40000,
    entryFee: 2000, teamsJoined: 10, totalSpots: 16, format: 'T10 · League',
    status: 'upcoming', organizerId: 'u2', startTimestamp: Date.now() + 1000 * 60 * 60 * 144,
  },
]

// ─── Turfs ──────────────────────────────────────────────────────

const turfs = [
  {
    turfId: 'tf1', name: 'Greenfield Arena', image: '/images/turf-football-night.png',
    location: 'Koramangala, Bengaluru', area: 'Koramangala', city: 'Bengaluru',
    ownerId: 'u3', rating: 4.9, reviews: 312, pricePerHour: 1200,
    sports: ['football'], slots: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
    amenities: ['Floodlights', 'Changing Room', 'Parking', 'Water'],
  },
  {
    turfId: 'tf2', name: 'Downtown Court', image: '/images/basketball-court.png',
    location: 'Indiranagar, Bengaluru', area: 'Indiranagar', city: 'Bengaluru',
    ownerId: 'u3', rating: 4.7, reviews: 188, pricePerHour: 900,
    sports: ['basketball', 'volleyball'], slots: ['5:00 PM', '6:00 PM', '8:00 PM'],
    amenities: ['Floodlights', 'Scoreboard', 'Water'],
  },
  {
    turfId: 'tf3', name: 'Turf Park Central', image: '/images/turf-arena-1.png',
    location: 'HSR Layout, Bengaluru', area: 'HSR Layout', city: 'Bengaluru',
    ownerId: 'u3', rating: 4.8, reviews: 256, pricePerHour: 1100,
    sports: ['football', 'cricket'], slots: ['4:00 PM', '7:00 PM', '9:00 PM', '10:00 PM'],
    amenities: ['Floodlights', 'Changing Room', 'Cafeteria', 'Parking'],
  },
  {
    turfId: 'tf4', name: 'Stadium Grounds', image: '/images/cricket-ground.png',
    location: 'Whitefield, Bengaluru', area: 'Whitefield', city: 'Bengaluru',
    ownerId: 'u3', rating: 4.6, reviews: 142, pricePerHour: 1500,
    sports: ['cricket'], slots: ['3:00 PM', '5:00 PM', '8:00 PM'],
    amenities: ['Floodlights', 'Practice Nets', 'Changing Room', 'Parking'],
  },
]

// ─── Player Stats ───────────────────────────────────────────────

const playerStats = [
  { playerId: 'p1', sport: 'football', matchesPlayed: 64, wins: 41, losses: 20, draws: 3, goals: 88, assists: 52, mvpAwards: 12, winRate: 64, currentStreak: 4, bestStreak: 7 },
  { playerId: 'p1', sport: 'cricket', matchesPlayed: 10, wins: 7, losses: 3, draws: 0, goals: 0, assists: 0, mvpAwards: 2, winRate: 70, currentStreak: 2, bestStreak: 4 },
  { playerId: 'p2', sport: 'football', matchesPlayed: 58, wins: 38, losses: 17, draws: 3, goals: 12, assists: 45, mvpAwards: 8, winRate: 66, currentStreak: 2, bestStreak: 5 },
  { playerId: 'p3', sport: 'football', matchesPlayed: 61, wins: 35, losses: 22, draws: 4, goals: 5, assists: 10, mvpAwards: 4, winRate: 57, currentStreak: 1, bestStreak: 4 },
  { playerId: 'p4', sport: 'football', matchesPlayed: 52, wins: 30, losses: 19, draws: 3, goals: 0, assists: 2, mvpAwards: 6, winRate: 58, currentStreak: 0, bestStreak: 3 },
  { playerId: 'p5', sport: 'football', matchesPlayed: 49, wins: 28, losses: 18, draws: 3, goals: 22, assists: 8, mvpAwards: 3, winRate: 57, currentStreak: 3, bestStreak: 5 },
  { playerId: 'p5', sport: 'basketball', matchesPlayed: 15, wins: 10, losses: 5, draws: 0, goals: 0, assists: 0, mvpAwards: 1, winRate: 67, currentStreak: 2, bestStreak: 4 },
  { playerId: 'p6', sport: 'football', matchesPlayed: 47, wins: 26, losses: 18, draws: 3, goals: 15, assists: 20, mvpAwards: 2, winRate: 55, currentStreak: 0, bestStreak: 3 },
]

// ─── Matches ────────────────────────────────────────────────────

const matches = [
  {
    matchId: 'match1', tournamentId: 't1',
    homeTeam: 'Thunder FC', awayTeam: 'Strikers United',
    homeTeamId: 'team1', awayTeamId: 'team2',
    homeScore: 2, awayScore: 1, status: 'live', sport: 'football', minute: 82,
    events: [
      { minute: 12, type: 'Goal', team: 'home', player: 'A. Mehta' },
      { minute: 24, type: 'Yellow Card', team: 'away', player: 'M. Joseph' },
      { minute: 38, type: 'Goal', team: 'away', player: 'R. Pillai' },
      { minute: 56, type: 'Assist', team: 'home', player: 'S. Khan' },
      { minute: 67, type: 'Goal', team: 'home', player: 'A. Mehta' },
      { minute: 81, type: 'Red Card', team: 'away', player: 'D. Kumar' },
    ],
    venue: 'Greenfield Arena', startTime: new Date().toISOString(),
  },
  {
    matchId: 'match2', tournamentId: 't1',
    homeTeam: 'Phoenix XI', awayTeam: 'Royal Kickers',
    homeTeamId: 'team3', awayTeamId: 'team4',
    homeScore: 0, awayScore: 0, status: 'upcoming', sport: 'football', minute: 0,
    events: [], venue: 'Greenfield Arena',
    startTime: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
  },
  {
    matchId: 'match3', tournamentId: 't4',
    homeTeam: 'Knight Riders', awayTeam: 'Chennai Warriors',
    homeTeamId: 'team_cr1', awayTeamId: 'team_cr2',
    homeScore: 145, awayScore: 132, status: 'completed', sport: 'cricket',
    events: [], venue: 'Stadium Grounds',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

// ─── Leaderboards ───────────────────────────────────────────────

const leaderboards = [
  { partitionKey: 'football#weekly', playerId: 'p1', playerName: 'Arjun Mehta', avatar: '/images/player-1.png', points: 2840, matches: 64, badge: 'Striker', change: 2 },
  { partitionKey: 'football#weekly', playerId: 'p2', playerName: 'Sara Khan', avatar: '/images/player-2.png', points: 2715, matches: 58, badge: 'Playmaker', change: 0 },
  { partitionKey: 'football#weekly', playerId: 'p3', playerName: 'Rohan Das', avatar: '/images/player-3.png', points: 2590, matches: 61, badge: 'Defender', change: 1 },
  { partitionKey: 'football#weekly', playerId: 'p4', playerName: 'Vikram Rao', avatar: '/images/player-1.png', points: 2410, matches: 52, badge: 'Keeper', change: -2 },
  { partitionKey: 'football#weekly', playerId: 'p5', playerName: 'Neha Iyer', avatar: '/images/player-2.png', points: 2300, matches: 49, badge: 'Winger', change: 3 },
  { partitionKey: 'football#weekly', playerId: 'p6', playerName: 'Karan Singh', avatar: '/images/player-3.png', points: 2180, matches: 47, badge: 'Midfield', change: -1 },
  { partitionKey: 'football#monthly', playerId: 'p1', playerName: 'Arjun Mehta', avatar: '/images/player-1.png', points: 8520, matches: 64, badge: 'Striker', change: 1 },
  { partitionKey: 'football#monthly', playerId: 'p2', playerName: 'Sara Khan', avatar: '/images/player-2.png', points: 8145, matches: 58, badge: 'Playmaker', change: 2 },
  { partitionKey: 'football#monthly', playerId: 'p3', playerName: 'Rohan Das', avatar: '/images/player-3.png', points: 7770, matches: 61, badge: 'Defender', change: 0 },
]

// ─── Main Seed Function ─────────────────────────────────────────

async function main() {
  const now = new Date().toISOString()
  console.log(`\n🌱 TurfArena Data Seeder`)
  console.log(`   Region: ${REGION}\n`)

  console.log('👤 Seeding Players...')
  for (const p of players) {
    await put('TurfArena_Players', { ...p, joinedAt: '2024-01-15', updatedAt: now })
  }
  console.log(`   ✓ ${players.length} players`)

  console.log('👥 Seeding Teams...')
  for (const t of teams) {
    await put('TurfArena_Teams', { ...t, createdAt: now, updatedAt: now })
  }
  console.log(`   ✓ ${teams.length} teams`)

  console.log('🏆 Seeding Tournaments...')
  for (const t of tournaments) {
    await put('TurfArena_Tournaments', { ...t, createdAt: now, updatedAt: now })
  }
  console.log(`   ✓ ${tournaments.length} tournaments`)

  console.log('🏟️  Seeding Turfs...')
  for (const t of turfs) {
    await put('TurfArena_Turfs', { ...t, createdAt: now, updatedAt: now })
  }
  console.log(`   ✓ ${turfs.length} turfs`)

  console.log('📊 Seeding Player Stats...')
  for (const s of playerStats) {
    await put('TurfArena_PlayerStats', { ...s, updatedAt: now })
  }
  console.log(`   ✓ ${playerStats.length} stat records`)

  console.log('⚽ Seeding Matches...')
  for (const m of matches) {
    await put('TurfArena_Matches', { ...m, createdAt: now, updatedAt: now })
  }
  console.log(`   ✓ ${matches.length} matches`)

  console.log('🥇 Seeding Leaderboards...')
  for (const l of leaderboards) {
    await put('TurfArena_Leaderboards', { ...l, updatedAt: now })
  }
  console.log(`   ✓ ${leaderboards.length} leaderboard entries`)

  console.log('\n✅ Seed complete! Your DynamoDB tables are populated.\n')
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
