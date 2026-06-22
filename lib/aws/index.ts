export { AWS_ENABLED, AWS_CONFIG } from './config'

export {
  VALKEY_ENABLED,
  getValkey,
  lockSlot,
  unlockSlot,
  markSlotBooked,
  isSlotBooked,
  getCachedAvailability,
  setCachedAvailability,
  cacheLiveScore,
  getCachedLiveScore,
  checkRateLimit,
} from './valkey'

export {
  docClient,
  TABLES,
  getItem,
  putItem,
  queryItems,
  scanItems,
  updateItem,
  deleteItem,
} from './dynamodb'

export {
  publishEvent,
  notifyTournamentCreated,
  notifyTeamRegistered,
  notifyMatchStarted,
  notifyScoreUpdated,
  notifyMatchCompleted,
  notifyBookingConfirmed,
  notifyPlayerAchievement,
  type TurfArenaEvent,
  type TurfArenaEventType,
} from './eventbridge'

export type {
  PlayerRecord,
  TeamRecord,
  TournamentRecord,
  TurfRecord,
  PlayerStatsRecord,
  MatchRecord,
  MatchEvent,
  BookingRecord,
  RegistrationRecord,
  LeaderboardRecord,
} from './tables'

export { TABLE_SCHEMAS } from './tables'
