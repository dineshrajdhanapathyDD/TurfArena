/**
 * DynamoDB Table Schemas for TurfArena
 *
 * Matches the DynamoDB Data Model from the spec:
 * - PLAYERS: playerId (PK), name, city, ranking
 * - TEAMS: teamId (PK), teamName, captainId
 * - TOURNAMENTS: tournamentId (PK), name, sport
 * - TURFS: turfId (PK), location, ownerId
 * - PLAYER_STATS: playerId (PK), matchesPlayed, wins, mvpAwards
 * - MATCHES: matchId (PK), tournamentId (SK/GSI), status, score
 *
 * Additional tables for full functionality:
 * - BOOKINGS: bookingId (PK), turfId (GSI), userId (GSI)
 * - LEADERBOARDS: sport#range (PK), playerId (SK)
 * - REGISTRATIONS: registrationId (PK), tournamentId (GSI)
 */

// ─── Type Definitions matching DynamoDB schema ──────────────────

export interface PlayerRecord {
  playerId: string
  name: string
  email: string
  city: string
  ranking: number
  avatar: string
  role: 'customer' | 'captain' | 'organizer' | 'owner'
  credits: number
  joinedAt: string
  updatedAt: string
}

export interface TeamRecord {
  teamId: string
  teamName: string
  captainId: string
  sport: string
  city: string
  members: string[] // player IDs
  wins: number
  losses: number
  ranking: number | null
  createdAt: string
  updatedAt: string
}

export interface TournamentRecord {
  tournamentId: string
  name: string
  sport: string
  image: string
  date: string
  venue: string
  city: string
  prizePool: number
  entryFee: number
  teamsJoined: number
  totalSpots: number
  format: string
  status: 'upcoming' | 'active' | 'completed'
  organizerId: string
  startTimestamp: number
  createdAt: string
  updatedAt: string
}

export interface TurfRecord {
  turfId: string
  name: string
  image: string
  location: string
  area: string
  city: string
  ownerId: string
  rating: number
  reviews: number
  pricePerHour: number
  sports: string[]
  slots: string[]
  amenities: string[]
  createdAt: string
  updatedAt: string
}

export interface PlayerStatsRecord {
  playerId: string
  sport: string // partition for per-sport stats
  matchesPlayed: number
  wins: number
  losses: number
  draws: number
  goals: number
  assists: number
  mvpAwards: number
  winRate: number
  currentStreak: number
  bestStreak: number
  updatedAt: string
}

export interface MatchRecord {
  matchId: string
  tournamentId: string
  homeTeam: string
  awayTeam: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number
  awayScore: number
  status: 'upcoming' | 'live' | 'completed'
  sport: string
  minute?: number
  events: MatchEvent[]
  venue: string
  startTime: string
  endTime?: string
  mvpPlayerId?: string
  createdAt: string
  updatedAt: string
}

export interface MatchEvent {
  minute?: number
  over?: string
  type: string
  team: 'home' | 'away'
  player: string
  details?: string
}

export interface BookingRecord {
  bookingId: string
  turfId: string
  turfName: string
  userId: string
  userName: string
  date: string
  slot: string
  sport: string
  amount: number
  status: 'confirmed' | 'cancelled' | 'completed'
  paymentId?: string
  createdAt: string
  updatedAt: string
}

export interface RegistrationRecord {
  registrationId: string
  tournamentId: string
  teamId: string
  teamName: string
  captainId: string
  playerIds: string[]
  entryFee: number
  status: 'pending' | 'confirmed' | 'rejected'
  paymentId?: string
  registeredAt: string
}

export interface LeaderboardRecord {
  partitionKey: string // e.g. "football#weekly", "cricket#alltime"
  playerId: string
  playerName: string
  avatar: string
  points: number
  matches: number
  badge: string
  change: number // position change
  updatedAt: string
}

// ─── Table Creation Schemas (for reference / CloudFormation) ────

export const TABLE_SCHEMAS = {
  Players: {
    TableName: 'TurfArena_Players',
    KeySchema: [{ AttributeName: 'playerId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'playerId', AttributeType: 'S' },
      { AttributeName: 'city', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CityIndex',
        KeySchema: [{ AttributeName: 'city', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },

  Teams: {
    TableName: 'TurfArena_Teams',
    KeySchema: [{ AttributeName: 'teamId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'teamId', AttributeType: 'S' },
      { AttributeName: 'captainId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CaptainIndex',
        KeySchema: [{ AttributeName: 'captainId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },

  Tournaments: {
    TableName: 'TurfArena_Tournaments',
    KeySchema: [{ AttributeName: 'tournamentId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'tournamentId', AttributeType: 'S' },
      { AttributeName: 'sport', AttributeType: 'S' },
      { AttributeName: 'status', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'SportStatusIndex',
        KeySchema: [
          { AttributeName: 'sport', KeyType: 'HASH' },
          { AttributeName: 'status', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },

  Turfs: {
    TableName: 'TurfArena_Turfs',
    KeySchema: [{ AttributeName: 'turfId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'turfId', AttributeType: 'S' },
      { AttributeName: 'ownerId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'OwnerIndex',
        KeySchema: [{ AttributeName: 'ownerId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },

  PlayerStats: {
    TableName: 'TurfArena_PlayerStats',
    KeySchema: [
      { AttributeName: 'playerId', KeyType: 'HASH' },
      { AttributeName: 'sport', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'playerId', AttributeType: 'S' },
      { AttributeName: 'sport', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },

  Matches: {
    TableName: 'TurfArena_Matches',
    KeySchema: [{ AttributeName: 'matchId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'matchId', AttributeType: 'S' },
      { AttributeName: 'tournamentId', AttributeType: 'S' },
      { AttributeName: 'status', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'TournamentIndex',
        KeySchema: [
          { AttributeName: 'tournamentId', KeyType: 'HASH' },
          { AttributeName: 'status', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },

  Bookings: {
    TableName: 'TurfArena_Bookings',
    KeySchema: [{ AttributeName: 'bookingId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'bookingId', AttributeType: 'S' },
      { AttributeName: 'turfId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'TurfIndex',
        KeySchema: [{ AttributeName: 'turfId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
      {
        IndexName: 'UserIndex',
        KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },

  Registrations: {
    TableName: 'TurfArena_Registrations',
    KeySchema: [{ AttributeName: 'registrationId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'registrationId', AttributeType: 'S' },
      { AttributeName: 'tournamentId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'TournamentIndex',
        KeySchema: [{ AttributeName: 'tournamentId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },

  Leaderboards: {
    TableName: 'TurfArena_Leaderboards',
    KeySchema: [
      { AttributeName: 'partitionKey', KeyType: 'HASH' },
      { AttributeName: 'playerId', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'partitionKey', AttributeType: 'S' },
      { AttributeName: 'playerId', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
}
