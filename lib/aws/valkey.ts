/**
 * AWS ElastiCache Valkey (Redis-compatible) Client
 *
 * Used for:
 * - Real-time slot locking during booking (prevents double-booking)
 * - Session caching
 * - Live match score caching (reduce DynamoDB reads)
 * - Rate limiting
 *
 * Connection: Set VALKEY_URL in env vars
 * Example: redis://default:password@your-cluster.cache.amazonaws.com:6379
 *
 * For ElastiCache Valkey in VPC:
 *   VALKEY_URL=rediss://your-cluster.xxxxx.use1.cache.amazonaws.com:6379
 *
 * Falls back gracefully if VALKEY_URL is not set (uses DynamoDB directly).
 */

import Redis from 'ioredis'

let redisClient: Redis | null = null

export const VALKEY_ENABLED = !!process.env.VALKEY_URL

export function getValkey(): Redis | null {
  if (!VALKEY_ENABLED) return null

  if (!redisClient) {
    redisClient = new Redis(process.env.VALKEY_URL!, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null // Stop retrying after 3 attempts
        return Math.min(times * 200, 2000)
      },
      connectTimeout: 5000,
      lazyConnect: true,
      // TLS for ElastiCache (rediss:// URLs)
      ...(process.env.VALKEY_URL?.startsWith('rediss://') && {
        tls: { rejectUnauthorized: false },
      }),
    })

    redisClient.on('error', (err) => {
      console.error('[Valkey] Connection error:', err.message)
    })
  }

  return redisClient
}

// ─── Slot Locking (Prevents Double-Booking) ─────────────────────

const LOCK_TTL = 300 // 5 minutes lock duration

/**
 * Try to lock a turf slot for booking.
 * Returns true if lock acquired (slot available), false if already locked.
 */
export async function lockSlot(turfId: string, date: string, slot: string): Promise<boolean> {
  const client = getValkey()
  if (!client) return true // If Valkey not available, allow booking (DynamoDB handles it)

  const key = `lock:slot:${turfId}:${date}:${slot}`

  try {
    // SET key value NX EX ttl — only sets if key doesn't exist
    const result = await client.set(key, 'locked', 'EX', LOCK_TTL, 'NX')
    return result === 'OK'
  } catch (error) {
    console.error('[Valkey] lockSlot error:', error)
    return true // Fail open — allow booking if cache is down
  }
}

/**
 * Release a slot lock (after booking completes or fails).
 */
export async function unlockSlot(turfId: string, date: string, slot: string): Promise<void> {
  const client = getValkey()
  if (!client) return

  const key = `lock:slot:${turfId}:${date}:${slot}`

  try {
    await client.del(key)
  } catch (error) {
    console.error('[Valkey] unlockSlot error:', error)
  }
}

/**
 * Mark a slot as permanently booked (after successful payment).
 */
export async function markSlotBooked(turfId: string, date: string, slot: string, bookingId: string): Promise<void> {
  const client = getValkey()
  if (!client) return

  const key = `booked:${turfId}:${date}:${slot}`

  try {
    // Store for 24 hours (slots are date-specific)
    await client.set(key, bookingId, 'EX', 86400)
  } catch (error) {
    console.error('[Valkey] markSlotBooked error:', error)
  }
}

/**
 * Check if a slot is already booked (fast cache check before DynamoDB).
 */
export async function isSlotBooked(turfId: string, date: string, slot: string): Promise<boolean> {
  const client = getValkey()
  if (!client) return false // If no cache, check DynamoDB

  const key = `booked:${turfId}:${date}:${slot}`

  try {
    const result = await client.exists(key)
    return result === 1
  } catch (error) {
    console.error('[Valkey] isSlotBooked error:', error)
    return false
  }
}

// ─── Available Slots (Real-time Availability) ────────────────────

/**
 * Get available slots for a turf on a specific date.
 * First checks Valkey cache, falls back to computing from DynamoDB.
 */
export async function getCachedAvailability(turfId: string, date: string): Promise<string[] | null> {
  const client = getValkey()
  if (!client) return null

  const key = `availability:${turfId}:${date}`

  try {
    const cached = await client.get(key)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error('[Valkey] getCachedAvailability error:', error)
    return null
  }
}

/**
 * Cache available slots (TTL 60 seconds for real-time freshness).
 */
export async function setCachedAvailability(turfId: string, date: string, slots: string[]): Promise<void> {
  const client = getValkey()
  if (!client) return

  const key = `availability:${turfId}:${date}`

  try {
    await client.set(key, JSON.stringify(slots), 'EX', 60) // 60 second TTL
  } catch (error) {
    console.error('[Valkey] setCachedAvailability error:', error)
  }
}

// ─── Live Score Caching ──────────────────────────────────────────

/**
 * Cache live match score (reduces DynamoDB reads during live matches).
 */
export async function cacheLiveScore(matchId: string, score: Record<string, unknown>): Promise<void> {
  const client = getValkey()
  if (!client) return

  const key = `live:score:${matchId}`

  try {
    await client.set(key, JSON.stringify(score), 'EX', 10) // 10 second TTL
  } catch (error) {
    console.error('[Valkey] cacheLiveScore error:', error)
  }
}

/**
 * Get cached live score.
 */
export async function getCachedLiveScore(matchId: string): Promise<Record<string, unknown> | null> {
  const client = getValkey()
  if (!client) return null

  const key = `live:score:${matchId}`

  try {
    const cached = await client.get(key)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error('[Valkey] getCachedLiveScore error:', error)
    return null
  }
}

// ─── Rate Limiting ───────────────────────────────────────────────

/**
 * Simple rate limiter: allow N requests per window.
 */
export async function checkRateLimit(identifier: string, maxRequests = 100, windowSeconds = 60): Promise<boolean> {
  const client = getValkey()
  if (!client) return true // No rate limiting if cache unavailable

  const key = `ratelimit:${identifier}`

  try {
    const current = await client.incr(key)
    if (current === 1) {
      await client.expire(key, windowSeconds)
    }
    return current <= maxRequests
  } catch (error) {
    console.error('[Valkey] checkRateLimit error:', error)
    return true
  }
}
