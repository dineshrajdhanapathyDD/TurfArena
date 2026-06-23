# TurfArena — The Operating System for Local Sports Communities

> A full-stack sports platform that connects players, teams, organizers, and turf owners — powered by AWS DynamoDB, EventBridge, Bedrock AI, and Valkey.

**Live:** [turf-arena-gilt.vercel.app](https://turf-arena-gilt.vercel.app) | **GitHub:** [github.com/dineshrajdhanapathyDD/TurfArena](https://github.com/dineshrajdhanapathyDD/TurfArena)

---

## The Problem We're Solving

Every weekend across India, thousands of turf grounds host football, cricket, basketball, and badminton matches. But behind the scenes, it's chaos:

- Tournaments managed via **WhatsApp groups** and Google Sheets
- No way for players to **track performance** across seasons
- Turf owners handling bookings through **phone calls** and paper registers
- Double-bookings are common — two teams show up for the same slot
- No centralized **rankings or statistics** for local sports communities

There's no "operating system" for this ecosystem. We built one.

---

## What is TurfArena?

TurfArena is a production-deployed platform with **22 API endpoints**, **44 pages**, and **9 DynamoDB tables** serving four distinct user roles:

| Role | What they do |
|------|-------------|
| **Player** | Join tournaments, track stats, get AI coaching, book turfs |
| **Team Captain** | Manage rosters, register for tournaments, view team analytics |
| **Tournament Organizer** | Create tournaments, manage live scores, track revenue |
| **Turf Owner** | Manage slot availability, view bookings, track income |

Each role gets a dedicated dashboard with role-specific navigation, data, and actions.

---

## Key Features

### 1. Real-Time Turf Booking with Double-Booking Prevention

The core booking challenge: what happens when two people try to book the same slot at the exact same moment?

We solved this with **Valkey** (Redis-compatible cache) using atomic locking:

```
User clicks "Book 7 PM slot"
  → API checks Valkey: EXISTS slot:turf1:2026-06-25:19:00
  → If free: SET slot:turf1:2026-06-25:19:00 NX EX 300
  → Only ONE user gets the lock (NX = "set if Not eXists")
  → Lock holder's booking is written to DynamoDB
  → Slot marked as booked for 24 hours
  → Second user gets "423 Slot Locked" response
```

This prevents race conditions that DynamoDB alone cannot handle at the millisecond level.

![Turf Booking Flow](./screenshots/turf-booking.png)

---

### 2. AI Coach (Amazon Bedrock — Nova Micro)

Every player gets a personal AI coach that analyzes their **real statistics** from DynamoDB:

**How it works:**
1. Player requests coaching tips
2. API queries `TurfArena_PlayerStats` table (composite key: `playerId + sport`)
3. Builds a context prompt with actual numbers: wins, losses, goals, MVP awards
4. Sends to Amazon Bedrock Nova Micro (`us.amazon.nova-micro-v1:0`)
5. Returns personalized recommendations

**AI capabilities:**
- Performance analysis (strengths, weaknesses, weekly goals)
- Match predictions (win probability from real stats)
- Team builder (optimal formations, chemistry scoring)
- Auto-commentary (narrative from live match events)
- Strategy suggestions (counter-tactics based on opponent data)

The AI isn't generic — it's grounded in the player's actual performance data.

![AI Coach](./screenshots/ai-coach.png)

---

### 3. Multi-Sport Live Scoring

Organizers update scores in real-time, and the system handles sport-specific events:

**Football:** Goals, assists, cards (yellow/red), substitutions, minute-by-minute timeline

**Cricket:** Runs, wickets, overs, extras, ball-by-ball commentary, run rate calculation

Each score update:
- Updates DynamoDB using `list_append` (adds events to array without overwriting)
- Publishes `score.updated` to EventBridge
- Clients poll every 5 seconds for latest data

---

### 4. Tournament Lifecycle Management

Full tournament flow from creation to results:

1. **Create** — Organizer sets format (knockout/league/group), entry fee, prize pool
2. **Registration** — Teams register via 3-step wizard (team info → roster → payment review)
3. **Brackets** — Auto-generated based on registered teams
4. **Live Matches** — Real-time score updates with event timeline
5. **Results** — Final standings, player stats updated, leaderboards recalculated

**DynamoDB operations per registration:**
- `PutItem` → Registrations table (team details)
- `UpdateItem` → Tournaments table (atomic `teamsJoined + 1`)
- EventBridge → `team.registered` event (for notifications)

The atomic counter ensures accurate team counts even under concurrent registrations.

---

### 5. GPS-Based Location Features

- **Nearby turfs** — Find turfs within X km using Haversine formula
- **200m geofencing** — Players can only check in to a match if GPS confirms they're within 200 meters of the venue
- **Live tracking** — Store player positions during match (foundation for future heatmaps)

---

### 6. Community & Social

- Post match results, achievements, and highlights
- Like and comment on posts
- Achievement badges (MVP, Hat-trick, Clean Sheet, 50 Goals)
- Leaderboards with weekly/monthly/all-time rankings

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENTS (Browser / Mobile PWA)                                      │
│ 4 Roles • 5 Sports • GPS • Dark Theme                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS (TLS 1.3)
┌────────────────────────────▼────────────────────────────────────────┐
│ VERCEL PLATFORM                                                     │
│ Next.js 16 (App Router) • 44 Pages (SSR + Static)                   │
│ 22 Serverless API Routes • Edge CDN • Vercel Analytics              │
│ Auth Middleware (RBAC) • Feature Flags (AWS_ENABLED)                 │
└───┬──────────────┬──────────────┬──────────────┬────────────────────┘
    │              │              │              │
    ▼              ▼              ▼              ▼
┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
│DynamoDB│  │  Valkey   │  │EventBridge│  │Amazon Bedrock│
│9 Tables│  │Slot Lock  │  │ 7 Events │  │  Nova Micro  │
│7 GSIs  │  │Rate Limit │  │           │  │  AI Coach    │
│<5ms    │  │Cache 60s  │  │           │  │  Predictions │
└────────┘  └──────────┘  └──────────┘  └──────────────┘
```

### Why This Architecture?

| Decision | Reasoning |
|----------|-----------|
| DynamoDB (not PostgreSQL) | Single-digit ms latency, zero server management, PAY_PER_REQUEST = $0 for hackathon |
| Valkey/Redis (not just DynamoDB) | DynamoDB can't do atomic `SET NX` — needed for sub-millisecond slot locking |
| EventBridge (not direct calls) | Decouples producers from consumers. Adding push notifications later = add a rule, no code change |
| Bedrock Nova Micro (not GPT) | AWS-native, fast, cost-effective. No external API dependency |
| Vercel (not EC2/ECS) | Zero-config deployment, serverless functions = Lambda equivalent, global CDN |
| OpenStreetMap (not Google Maps) | Free, no API key, no billing surprises |

---

## DynamoDB Design

### 9 Tables with Purpose-Built Access Patterns

| Table | Primary Key | GSIs | Key Pattern |
|-------|-------------|------|-------------|
| Players | `playerId` | CityIndex | "All players in Bengaluru" |
| Teams | `teamId` | CaptainIndex | "All teams managed by captain X" |
| Tournaments | `tournamentId` | SportStatusIndex | "All active football tournaments" |
| Matches | `matchId` | TournamentIndex | "All live matches in tournament T" |
| Turfs | `turfId` | OwnerIndex | "All turfs owned by owner Y" |
| Bookings | `bookingId` | TurfIndex, UserIndex | "All bookings for turf Z" / "My bookings" |
| PlayerStats | `playerId` + `sport` | — | "Football stats for player P" (composite key) |
| Registrations | `registrationId` | TournamentIndex | "All registered teams" |
| Leaderboards | `partitionKey` + `playerId` | — | "Weekly football leaderboard" |

### Advanced DynamoDB Features Used

- **Atomic counters** — `SET teamsJoined = teamsJoined + :inc` (no race conditions)
- **List append** — `list_append(events, :newEvent)` (add match events without overwriting)
- **Composite keys** — PlayerStats uses `playerId + sport` for per-sport queries
- **Conditional writes** — Tournament capacity check before registration
- **7 GSIs** — Efficient queries without table scans

---

## Event-Driven Architecture

Every significant action publishes an event to EventBridge:

| Event | When | Future Consumer |
|-------|------|----------------|
| `tournament.created` | Organizer publishes tournament | SNS → push to players |
| `team.registered` | Team joins tournament | Email confirmation |
| `match.started` | Match kicks off | Live score notifications |
| `score.updated` | Each goal/wicket/card | Real-time push to viewers |
| `match.completed` | Final whistle | Stats update, leaderboard recalc |
| `booking.confirmed` | Slot booked | SMS confirmation to player |
| `player.achievement` | Badge unlocked | Community feed post |

Adding new consumers (Lambda, SQS, SNS) requires **zero code changes** — just add an EventBridge rule.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 | App Router SSR, dark theme, 44 pages |
| **Animation** | Framer Motion | Smooth page transitions |
| **Maps** | Leaflet + OpenStreetMap | Free, no API key |
| **Icons** | Lucide React | Consistent iconography |
| **Backend** | Vercel Serverless Functions | 22 API routes, zero config |
| **Database** | Amazon DynamoDB | 9 tables, <5ms, PAY_PER_REQUEST |
| **Cache** | Upstash Valkey (Redis) | Slot locking, rate limiting |
| **Events** | Amazon EventBridge | 7 event types, decoupled |
| **AI** | Amazon Bedrock (Nova Micro) | 5 AI functions from real stats |
| **Deployment** | Vercel + GitHub | Auto-deploy, Edge CDN |
| **Region** | AWS us-east-1 | All services co-located |

---

## Challenges & Solutions

### Double-Booking Race Condition
**Problem:** Two users booking same slot within milliseconds both succeed.  
**Solution:** Valkey `SET NX EX 300` — atomic lock that only one request can acquire.

### Turbopack Build Failure
**Problem:** Space in directory path (`D:\github work\`) broke Next.js Turbopack.  
**Solution:** `next build --webpack` flag bypasses Turbopack entirely.

### Silent DynamoDB Fallback
**Problem:** Vercel's built-in DynamoDB integration overrode env vars with empty strings — app silently used mock data.  
**Solution:** Removed integration, set env vars via CLI. Added `AWS_ENABLED` feature flag for explicit control.

### Dark Theme Contrast
**Problem:** `text-gray-600` on `bg-white` became invisible with dark theme.  
**Solution:** Audited all 44 pages, replaced with theme-aware CSS variables.

### Real-Time Without WebSocket
**Problem:** DynamoDB doesn't support push. Live scores needed instant updates.  
**Solution:** EventBridge for event bus + client-side polling (5s). WebSocket planned for Phase 2.

---

## Cost

| Service | Monthly Cost |
|---------|-------------|
| DynamoDB (PAY_PER_REQUEST) | $0 (free tier: 25 RCU + 25 WCU) |
| EventBridge | $0 (14M events/month free) |
| Valkey / Upstash Redis | $0 (10K commands/day free) |
| Amazon Bedrock (Nova Micro) | ~$0.01 per 1K tokens |
| Vercel Hobby | $0 |
| OpenStreetMap | $0 |
| **Total** | **$0/month** (within free tiers) |

The entire production platform runs at zero cost for development and demos.

---

## What's Next

| Phase | Feature | Technology |
|-------|---------|-----------|
| 1 | Real-time WebSocket scores | API Gateway WebSocket |
| 1 | Push notifications | EventBridge → SNS |
| 2 | Payment integration | Razorpay |
| 2 | Image uploads | S3 + CloudFront |
| 2 | Proper authentication | Amazon Cognito |
| 3 | Multi-city expansion | DynamoDB Global Tables |
| 3 | ML-based predictions | Amazon SageMaker |
| 4 | Native mobile apps | React Native |
| 4 | Sponsorship marketplace | Brand partnerships |

---

## Try It

```bash
# Clone and run locally (no AWS needed — uses mock data)
git clone https://github.com/dineshrajdhanapathyDD/TurfArena.git
cd TurfArena
npm install
npm run dev
# Open http://localhost:3000

# Login as different roles:
# Player:    customer@turf.com / customer123
# Organizer: organizer@turf.com / organizer123
# Owner:     owner@turf.com / owner123
```

```bash
# Connect to AWS (optional)
# Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in .env.local
npm run aws:init   # Creates 9 tables + seeds demo data
npm run dev        # Now connected to real DynamoDB
```

---

## Screenshots

| Feature | Screenshot |
|---------|-----------|
| Player Dashboard | ![Dashboard](./screenshots/player-dashboard.png) |
| AI Coach | ![AI](./screenshots/ai-coach.png) |
| Turf Booking | ![Booking](./screenshots/turf-booking.png) |
| Live Match | ![Live](./screenshots/live-match-football.png) |
| Tournament Detail | ![Tournament](./screenshots/tournament-detail.png) |
| Owner Dashboard | ![Owner](./screenshots/owner-dashboard.png) |
| Organizer Dashboard | ![Organizer](./screenshots/organizer-dashboard.png) |
| Map View | ![Map](./screenshots/map-view.png) |
| Mobile View | ![Mobile](./screenshots/mobile-responsive.png) |
| DynamoDB Tables | ![DynamoDB](./screenshots/dynamodb-tables.png) |

---

## Recognition

Built for the **H0: Hack the Zero Stack with Vercel v0 and AWS Databases** hackathon.

### Judging Criteria Alignment

| Criteria (25% each) | How TurfArena Delivers |
|---------------------|----------------------|
| **Technical Implementation** | 9 DynamoDB tables, 7 GSIs, atomic counters, composite keys, 22 API endpoints, Valkey locking, Bedrock AI, EventBridge events |
| **Design** | Mobile-first dark theme, 44 pages, glassmorphism UI, Framer Motion animations, consistent design system |
| **Impact** | Solves real booking and tournament management problems for millions of turf users in India |
| **Originality** | AI coaching from real stats, GPS geofencing check-in, Valkey slot locking, multi-sport live scoring |

---

*TurfArena — where every player has a profile, every match has a story, and every turf has a platform.*
