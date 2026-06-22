# TurfArena — DynamoDB Functionality & Observability

## DynamoDB Functionality

### How DynamoDB Is Used

TurfArena uses Amazon DynamoDB as its primary database with 9 tables, PAY_PER_REQUEST billing, and Global Secondary Indexes (GSIs) for efficient querying.

### Table Operations Summary

| API Endpoint | DynamoDB Operation | Table | Purpose |
|-------------|-------------------|-------|---------|
| `GET /api/tournaments` | Query (GSI) / Scan | Tournaments | List by sport using SportStatusIndex |
| `POST /api/tournaments` | PutItem | Tournaments | Create new tournament |
| `PATCH /api/tournaments/:id` | UpdateItem | Tournaments | Update tournament details |
| `POST /api/tournaments/:id/register` | PutItem + UpdateItem | Registrations + Tournaments | Register team, increment teamsJoined |
| `GET /api/matches` | Query (GSI) / Scan | Matches | List by tournament using TournamentIndex |
| `POST /api/matches` | PutItem | Matches | Create match record |
| `PATCH /api/matches/:id/score` | GetItem + UpdateItem | Matches | Live score update with event append |
| `GET /api/players` | Scan / GetItem | Players | List players, get by ID |
| `GET /api/players/:id/stats` | Query | PlayerStats | Get per-sport stats (composite key) |
| `GET /api/teams` | Query (GSI) / Scan | Teams | List by captain using CaptainIndex |
| `POST /api/teams` | PutItem | Teams | Create team |
| `GET /api/turfs` | Query (GSI) / Scan | Turfs | List by owner using OwnerIndex |
| `POST /api/turfs/:id/book` | GetItem + PutItem | Turfs + Bookings | Verify turf, create booking |

### Key DynamoDB Features Used

#### 1. Single-Table-Like Access Patterns

Each table is optimized for its primary access pattern:

```
TurfArena_Matches
├── Primary Key: matchId (HASH)
├── GSI: TournamentIndex (tournamentId + status)
│   └── "Get all matches for tournament t1 that are live"
└── Operations:
    ├── GetItem → Get match by ID (< 5ms)
    ├── UpdateItem → Atomic score update
    └── Query GSI → All matches in a tournament
```

#### 2. Atomic Counters (UpdateItem)

When a team registers for a tournament, we atomically increment the counter:

```typescript
// app/api/tournaments/[id]/register/route.ts
await updateItem(
  TABLES.TOURNAMENTS,
  { tournamentId: id },
  'SET teamsJoined = teamsJoined + :inc, updatedAt = :now',
  { ':inc': 1, ':now': new Date().toISOString() }
)
```

This prevents race conditions — even if two teams register simultaneously, the count stays accurate.

#### 3. List Append (Live Events)

Match events are appended to an array in real-time:

```typescript
// app/api/matches/[id]/score/route.ts
if (event) {
  updateParts.push('events = list_append(events, :newEvent)')
  expressionValues[':newEvent'] = [event]
}
```

This adds new events (goals, cards, wickets) to the existing events list without overwriting.

#### 4. Conditional Expressions

Tournament registration checks capacity before allowing new teams:

```typescript
const tournament = await getItem(TABLES.TOURNAMENTS, { tournamentId: id })
if (tournament.teamsJoined >= tournament.totalSpots) {
  return NextResponse.json({ error: 'Tournament is full' }, { status: 409 })
}
```

#### 5. Global Secondary Indexes (GSIs)

| Table | GSI Name | Key Schema | Use Case |
|-------|----------|-----------|----------|
| Players | CityIndex | city (HASH) | "All players in Bengaluru" |
| Teams | CaptainIndex | captainId (HASH) | "All teams managed by this captain" |
| Tournaments | SportStatusIndex | sport (HASH) + status (RANGE) | "All active football tournaments" |
| Turfs | OwnerIndex | ownerId (HASH) | "All turfs owned by this owner" |
| Matches | TournamentIndex | tournamentId (HASH) + status (RANGE) | "All live matches in this tournament" |
| Bookings | TurfIndex | turfId (HASH) | "All bookings for this turf" |
| Bookings | UserIndex | userId (HASH) | "All bookings by this user" |
| Registrations | TournamentIndex | tournamentId (HASH) | "All registered teams" |

#### 6. Composite Keys (PlayerStats)

PlayerStats uses a composite key for per-sport statistics:

```
Partition Key: playerId
Sort Key: sport

Query: "Get all stats for player p1"
  → Returns: [{ sport: 'football', wins: 41 }, { sport: 'cricket', wins: 7 }]

Query: "Get football stats for player p1"  
  → Returns: [{ sport: 'football', wins: 41, goals: 88 }]
```

### DynamoDB Performance Characteristics

| Operation | Latency | Cost Model |
|-----------|---------|-----------|
| GetItem (by key) | 1-5ms | 0.5 RCU per 4KB |
| PutItem | 1-5ms | 1 WCU per 1KB |
| Query (GSI) | 5-10ms | 0.5 RCU per 4KB returned |
| UpdateItem | 1-5ms | 1 WCU per 1KB |
| Scan (full table) | 10-100ms | 0.5 RCU per 4KB scanned |

### Data Flow Example: Live Score Update

```
1. Organizer clicks "Goal scored by A. Mehta at 67'"
2. Frontend: PATCH /api/matches/match1/score
   Body: { homeScore: 3, event: { minute: 67, type: 'Goal', team: 'home', player: 'A. Mehta' } }

3. API Route (app/api/matches/[id]/score/route.ts):
   a. GetItem(TurfArena_Matches, { matchId: 'match1' })  → verify match exists
   b. UpdateItem → SET homeScore = 3, events = list_append(events, [newGoalEvent])
   c. EventBridge → PutEvents({ type: 'score.updated', detail: { matchId, homeScore: 3 } })

4. DynamoDB stores:
   {
     matchId: 'match1',
     homeScore: 3,
     events: [...existingEvents, { minute: 67, type: 'Goal', player: 'A. Mehta' }],
     updatedAt: '2026-06-21T12:00:00Z'
   }

5. EventBridge routes notification → (future: push to connected clients via WebSocket)
```

---

## Observability

### Current Observability Stack

| Layer | Tool | What It Tracks |
|-------|------|---------------|
| **Frontend** | Vercel Analytics | LCP, CLS, INP, TTFB (Core Web Vitals) |
| **Frontend** | Vercel Speed Insights | Per-route load times |
| **API** | Structured Console Logging | All errors with context |
| **Database** | DynamoDB CloudWatch Metrics | Read/Write capacity, throttles, latency |
| **Events** | EventBridge Metrics | Events published, failed deliveries |

### Structured Error Logging

Every API route logs errors with context:

```typescript
// Pattern used in all API routes:
try {
  // DynamoDB operation
} catch (error) {
  console.error('[DynamoDB] GET /api/tournaments:', error)
  return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
}
```

Log format on Vercel:
```
[DynamoDB] GET /api/tournaments: ResourceNotFoundException: Table not found
[API Error] PATCH /api/matches/:id/score: ValidationException: Invalid update expression
[EventBridge Error] Failed to publish score.updated event
```

### DynamoDB CloudWatch Metrics

These metrics are automatically available in AWS CloudWatch for all TurfArena tables:

| Metric | What It Shows | Alert Threshold |
|--------|-------------|----------------|
| `ConsumedReadCapacityUnits` | Total reads per second | > 25 (free tier limit) |
| `ConsumedWriteCapacityUnits` | Total writes per second | > 25 (free tier limit) |
| `ThrottledRequests` | Requests that exceeded capacity | > 0 |
| `SuccessfulRequestLatency` | DynamoDB response time | p99 > 20ms |
| `SystemErrors` | Internal DynamoDB errors | > 0 |
| `UserErrors` | Client-side errors (bad requests) | > 10/min |

### How to View Metrics

#### Vercel Dashboard (Frontend)
```
Vercel → Project → Analytics tab
├── Core Web Vitals (LCP, CLS, INP)
├── Page load times per route
├── Visitor count and geography
└── Function execution times
```

#### AWS CloudWatch (Database)
```
AWS Console → CloudWatch → Metrics → DynamoDB
├── Table: TurfArena_Matches
│   ├── ConsumedReadCapacityUnits
│   ├── ConsumedWriteCapacityUnits
│   └── SuccessfulRequestLatency
├── Table: TurfArena_Tournaments
│   └── (same metrics)
└── Account-level throttle count
```

#### Vercel Function Logs (API)
```
Vercel → Project → Logs tab
├── Filter by: "Runtime Logs"
├── Shows: all console.error() output
└── Includes: request ID, duration, status code
```

### Observability in Code

#### 1. Vercel Analytics (already integrated)

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/next'

// Automatically tracks:
// - Page views
// - Core Web Vitals
// - Route transitions
{process.env.NODE_ENV === 'production' && <Analytics />}
```

#### 2. API Response Timing

Every API response includes timing info:

```typescript
// Response headers (automatic from Vercel):
// x-vercel-execution-region: iad1
// x-vercel-cache: MISS
// duration: 23ms
```

#### 3. AWS_ENABLED Feature Flag (Graceful Degradation)

```typescript
// lib/aws/config.ts
export const AWS_ENABLED = !!process.env.AWS_REGION

// If DynamoDB is down or misconfigured:
// - App automatically falls back to mock data
// - No crash, no 500 errors
// - Users still see content (stale but functional)
```

### Recommended CloudWatch Alarms

Create these alarms for production monitoring:

```bash
# Alarm: DynamoDB throttling detected
aws cloudwatch put-metric-alarm \
  --alarm-name "TurfArena-DynamoDB-Throttle" \
  --metric-name ThrottledRequests \
  --namespace AWS/DynamoDB \
  --statistic Sum \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --evaluation-periods 1 \
  --dimensions Name=TableName,Value=TurfArena_Matches \
  --alarm-actions "arn:aws:sns:us-east-1:466742534146:TurfArena-Alerts" \
  --region us-east-1

# Alarm: High latency on Matches table
aws cloudwatch put-metric-alarm \
  --alarm-name "TurfArena-Matches-HighLatency" \
  --metric-name SuccessfulRequestLatency \
  --namespace AWS/DynamoDB \
  --statistic p99 \
  --period 60 \
  --threshold 20 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 3 \
  --dimensions Name=TableName,Value=TurfArena_Matches Name=Operation,Value=UpdateItem \
  --region us-east-1

# Alarm: EventBridge failed deliveries
aws cloudwatch put-metric-alarm \
  --alarm-name "TurfArena-EventBridge-Failures" \
  --metric-name FailedInvocations \
  --namespace AWS/Events \
  --statistic Sum \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --evaluation-periods 1 \
  --region us-east-1
```

### Observability Architecture

```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND OBSERVABILITY                                  │
├─────────────────────────────────────────────────────────┤
│ Vercel Analytics → Core Web Vitals (LCP, CLS, INP)     │
│ Vercel Speed Insights → Per-route performance          │
│ Vercel Logs → Serverless function execution logs       │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│ API OBSERVABILITY                                       │
├─────────────────────────────────────────────────────────┤
│ Structured Logging → [DynamoDB] [EventBridge] [API]     │
│ Error Context → Table name, operation, request body     │
│ Feature Flag → AWS_ENABLED graceful degradation         │
│ Response Codes → 200, 201, 400, 404, 409, 500          │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│ DATABASE OBSERVABILITY (CloudWatch)                     │
├─────────────────────────────────────────────────────────┤
│ ConsumedReadCapacityUnits → Read throughput             │
│ ConsumedWriteCapacityUnits → Write throughput           │
│ ThrottledRequests → Capacity exceeded                   │
│ SuccessfulRequestLatency → Response time (p50, p99)    │
│ SystemErrors → DynamoDB internal failures              │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│ EVENTS OBSERVABILITY (CloudWatch)                       │
├─────────────────────────────────────────────────────────┤
│ Invocations → Events published to bus                   │
│ FailedInvocations → Events that failed to deliver      │
│ TriggeredRules → Rules matched per event               │
└─────────────────────────────────────────────────────────┘
```

### Planned Observability Enhancements

| Enhancement | Tool | Benefit |
|------------|------|---------|
| Distributed Tracing | AWS X-Ray | End-to-end request tracing across API → DynamoDB → EventBridge |
| Custom Dashboard | CloudWatch Dashboard | Single pane of glass for all TurfArena metrics |
| Alerting | CloudWatch Alarms + SNS | Email/SMS alerts for throttles, errors, latency |
| APM | Vercel Pro Plan | Detailed function-level performance breakdowns |
| Error Tracking | Sentry (planned) | Stack traces, error grouping, user impact |
| Real-time Logs | CloudWatch Logs Insights | Query-based log analysis |

### Useful CloudWatch Queries

```sql
-- Find all throttled requests in last hour
SELECT TableName, SUM(ThrottledRequests) 
FROM SCHEMA("AWS/DynamoDB", TableName)
WHERE ThrottledRequests > 0
GROUP BY TableName

-- Average latency per table
SELECT TableName, AVG(SuccessfulRequestLatency)
FROM SCHEMA("AWS/DynamoDB", TableName, Operation)
GROUP BY TableName
ORDER BY AVG(SuccessfulRequestLatency) DESC
```

### Cost Monitoring

With PAY_PER_REQUEST billing, monitor costs via:

```
AWS Console → Billing → Cost Explorer
├── Filter: Service = DynamoDB
├── Group by: Usage Type
└── Shows: ReadRequestUnits, WriteRequestUnits costs

Current estimate (hackathon/demo usage):
├── DynamoDB: $0.00 (within free tier)
├── EventBridge: $0.00 (within free tier)  
└── Total: $0.00/month
```
