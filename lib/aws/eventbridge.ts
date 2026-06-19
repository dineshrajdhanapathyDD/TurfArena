import {
  EventBridgeClient,
  PutEventsCommand,
  type PutEventsRequestEntry,
} from '@aws-sdk/client-eventbridge'

const eventBridgeClient = new EventBridgeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  }),
})

const EVENT_BUS_NAME = process.env.EVENTBRIDGE_BUS_NAME || 'TurfArena-Events'

// ─── Event Types ────────────────────────────────────────────────

export type TurfArenaEventType =
  | 'tournament.created'
  | 'tournament.started'
  | 'tournament.completed'
  | 'team.registered'
  | 'match.started'
  | 'match.goal'
  | 'match.wicket'
  | 'match.completed'
  | 'booking.confirmed'
  | 'booking.cancelled'
  | 'player.achievement'
  | 'leaderboard.updated'
  | 'score.updated'

export interface TurfArenaEvent {
  type: TurfArenaEventType
  source: string
  detail: Record<string, unknown>
  userId?: string
}

// ─── Publish Events ─────────────────────────────────────────────

export async function publishEvent(event: TurfArenaEvent): Promise<boolean> {
  // Skip in development if no EventBridge configured
  if (!process.env.AWS_REGION && process.env.NODE_ENV === 'development') {
    console.log('[EventBridge Mock]', event.type, event.detail)
    return true
  }

  const entry: PutEventsRequestEntry = {
    EventBusName: EVENT_BUS_NAME,
    Source: `turfarena.${event.source}`,
    DetailType: event.type,
    Detail: JSON.stringify({
      ...event.detail,
      userId: event.userId,
      timestamp: new Date().toISOString(),
    }),
    Time: new Date(),
  }

  try {
    const command = new PutEventsCommand({ Entries: [entry] })
    const result = await eventBridgeClient.send(command)
    return result.FailedEntryCount === 0
  } catch (error) {
    console.error('[EventBridge Error]', error)
    return false
  }
}

// ─── Convenience Methods ────────────────────────────────────────

export async function notifyTournamentCreated(tournamentId: string, name: string, organizerId: string) {
  return publishEvent({
    type: 'tournament.created',
    source: 'tournaments',
    userId: organizerId,
    detail: { tournamentId, name, organizerId },
  })
}

export async function notifyTeamRegistered(tournamentId: string, teamId: string, teamName: string, captainId: string) {
  return publishEvent({
    type: 'team.registered',
    source: 'registrations',
    userId: captainId,
    detail: { tournamentId, teamId, teamName, captainId },
  })
}

export async function notifyMatchStarted(matchId: string, tournamentId: string, homeTeam: string, awayTeam: string) {
  return publishEvent({
    type: 'match.started',
    source: 'matches',
    detail: { matchId, tournamentId, homeTeam, awayTeam },
  })
}

export async function notifyScoreUpdated(matchId: string, homeScore: number, awayScore: number, event: string) {
  return publishEvent({
    type: 'score.updated',
    source: 'matches',
    detail: { matchId, homeScore, awayScore, event },
  })
}

export async function notifyMatchCompleted(
  matchId: string,
  tournamentId: string,
  winner: string,
  homeScore: number,
  awayScore: number,
  mvpPlayerId?: string
) {
  return publishEvent({
    type: 'match.completed',
    source: 'matches',
    detail: { matchId, tournamentId, winner, homeScore, awayScore, mvpPlayerId },
  })
}

export async function notifyBookingConfirmed(bookingId: string, turfName: string, userId: string, date: string, slot: string) {
  return publishEvent({
    type: 'booking.confirmed',
    source: 'bookings',
    userId,
    detail: { bookingId, turfName, date, slot },
  })
}

export async function notifyPlayerAchievement(playerId: string, achievement: string, description: string) {
  return publishEvent({
    type: 'player.achievement',
    source: 'players',
    userId: playerId,
    detail: { playerId, achievement, description },
  })
}
