import Redis from 'ioredis'

const VALKEY_URL = process.env.VALKEY_URL || 'rediss://default:gQAAAAAAAWmIAAIgcDE4YjJmYmI0NTZhYjY0ZTMzYWExOTZhZGMzMGRkZjc4MQ@lucky-bedbug-92552.upstash.io:6379'

async function main() {
  console.log('🔗 Connecting to Valkey/Redis...')
  
  const redis = new Redis(VALKEY_URL, {
    tls: { rejectUnauthorized: false },
    connectTimeout: 5000,
  })

  try {
    // Test 1: PING
    const pong = await redis.ping()
    console.log(`✅ PING: ${pong}`)

    // Test 2: SET/GET
    await redis.set('turfarena:test', 'alive', 'EX', 60)
    const val = await redis.get('turfarena:test')
    console.log(`✅ SET/GET: ${val}`)

    // Test 3: Slot locking simulation
    const lockKey = 'lock:slot:tf1:2025-06-21:6PM'
    const locked = await redis.set(lockKey, 'locked', 'EX', 300, 'NX')
    console.log(`✅ Slot Lock: ${locked === 'OK' ? 'acquired' : 'already taken'}`)

    // Test 4: Check slot
    const exists = await redis.exists(lockKey)
    console.log(`✅ Slot Exists: ${exists === 1}`)

    // Cleanup
    await redis.del(lockKey)
    await redis.del('turfarena:test')
    console.log(`✅ Cleanup done`)

    console.log('\n🎉 Valkey connection successful! Real-time booking ready.')
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`)
  } finally {
    redis.disconnect()
  }
}

main()
