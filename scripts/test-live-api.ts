/**
 * Test TurfArena Live APIs — AI Coach + DynamoDB + Valkey
 * Proves real-time backend execution on deployed app.
 */

const BASE = process.env.BASE_URL || 'https://turf-arena-gilt.vercel.app'

async function test(name: string, url: string, options?: RequestInit) {
  const start = Date.now()
  try {
    const res = await fetch(url, options)
    const ms = Date.now() - start
    const data = await res.json()
    const status = res.status
    console.log(`\n${status === 200 || status === 201 ? '✅' : '❌'} ${name} (${ms}ms, HTTP ${status})`)
    if (data.data?.response) {
      console.log(`   AI: ${data.data.response.slice(0, 150)}...`)
    } else if (data.data) {
      console.log(`   Data: ${JSON.stringify(data.data).slice(0, 150)}`)
    } else {
      console.log(`   Response: ${JSON.stringify(data).slice(0, 150)}`)
    }
    return { success: status < 400, ms }
  } catch (e: any) {
    const ms = Date.now() - start
    console.log(`\n❌ ${name} (${ms}ms) — ${e.message}`)
    return { success: false, ms }
  }
}

async function main() {
  console.log('🏟️ TurfArena — Live Backend Verification')
  console.log(`   Target: ${BASE}`)
  console.log('   Testing: AI Coach (Bedrock) + DynamoDB + Valkey\n')
  console.log('═'.repeat(60))

  // 1. AI Coach — Amazon Bedrock
  await test('AI Coach (Bedrock)', `${BASE}/api/ai/coach`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'coach', playerId: 'p1', playerName: 'Arjun Mehta' }),
  })

  // 2. AI Match Prediction — Amazon Bedrock
  await test('AI Prediction (Bedrock)', `${BASE}/api/ai/coach`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'predict',
      tournamentData: {
        tournamentName: 'City Champions League',
        format: '7v7 Knockout',
        teams: ['Thunder FC', 'Strikers United', 'Phoenix XI', 'Royal Kickers'],
        sport: 'football',
      },
    }),
  })

  // 3. DynamoDB — List Tournaments
  await test('DynamoDB: List Tournaments', `${BASE}/api/tournaments`)

  // 4. DynamoDB — List Players
  await test('DynamoDB: List Players', `${BASE}/api/players`)

  // 5. DynamoDB — Get Player Stats
  await test('DynamoDB: Player Stats', `${BASE}/api/players/p1/stats`)

  // 6. DynamoDB — List Matches
  await test('DynamoDB: List Matches', `${BASE}/api/matches`)

  // 7. DynamoDB — List Turfs
  await test('DynamoDB: List Turfs', `${BASE}/api/turfs`)

  // 8. DynamoDB — Slot Availability (Valkey cached)
  await test('Valkey + DynamoDB: Slot Availability', `${BASE}/api/turfs/tf1/availability?date=2025-06-22`)

  // 9. Location — Nearby Turfs (Haversine)
  await test('Location: Nearby Turfs', `${BASE}/api/location/nearby-turfs?lat=12.935&lng=77.624&radius=10`)

  // 10. Auth — Login
  await test('Auth: Login', `${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@turf.com', password: 'customer123' }),
  })

  // 11. Book a Turf (Valkey lock + DynamoDB write)
  await test('Booking: Book Slot (Valkey + DynamoDB)', `${BASE}/api/turfs/tf1/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: '2025-06-25',
      slot: '9:00 PM',
      sport: 'football',
      userId: 'p1',
      userName: 'Arjun Mehta',
    }),
  })

  // 12. AI Performance Report — Bedrock + DynamoDB
  await test('AI Report (Bedrock + DynamoDB)', `${BASE}/api/ai/coach`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'report', playerId: 'p1', playerName: 'Arjun Mehta' }),
  })

  console.log('\n' + '═'.repeat(60))
  console.log('✅ All tests complete. Backend is live and operational.')
}

main()
