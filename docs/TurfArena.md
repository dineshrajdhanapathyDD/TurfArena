# TurfArena — The Operating System for Local Sports Communities

> A full-stack sports platform connecting players, teams, organizers, and turf owners — built with **Vercel v0**, deployed on **Vercel**, powered by **AWS DynamoDB, EventBridge, Bedrock AI, and Valkey**.

**Live:** [turf-arena-gilt.vercel.app](https://turf-arena-gilt.vercel.app)  
**GitHub:** [github.com/dineshrajdhanapathyDD/TurfArena](https://github.com/dineshrajdhanapathyDD/TurfArena)

---

## Deployed on Vercel

| | Details |
|---|---------|
| **Frontend Generation** | [Vercel v0](https://v0.dev)  AI-powered, describe UI → get production-ready React/Next.js + Tailwind CSS, deploy in one click |
| **Hosting** | Vercel Edge Network — global CDN, serverless functions |
| **CI/CD** | GitHub → Vercel auto-deploy (push to main = live in ~35s) |
| **Framework** | Next.js 16 (auto-detected) |
| **Build** | `next build --webpack` with SWC minification |
| **Live URL** | [turf-arena-gilt.vercel.app](https://turf-arena-gilt.vercel.app) |

---

## The Problem

Every weekend across India, thousands of turf grounds host football, cricket, and basketball matches. But:

- Tournaments managed via **WhatsApp groups** and spreadsheets
- No way for players to **track performance** across seasons
- Turf owners handling bookings through **phone calls** — double-bookings happen constantly
- No centralized **rankings or statistics**

---

## The Solution

TurfArena serves **4 user roles** with **22 API endpoints**, **44 pages**, and **9 DynamoDB tables**:

| Role | What they do |
|------|-------------|
| **Player** | Join tournaments, track stats, get AI coaching, book turfs |
| **Team Captain** | Manage rosters, register for tournaments |
| **Tournament Organizer** | Create tournaments, manage live scores, track revenue |
| **Turf Owner** | Manage slot availability, view bookings, track income |

---

## Architecture 
![Architecture](./turfarena%20architecture%20v4.gif)

```
User (Browser)
  │
  │ HTTPS
  ▼
Vercel Edge CDN
  │
  ▼
Next.js 16 (SSR + 22 API Routes)
  │
  ├──── DynamoDB (9 tables) ──── Read/Write via AWS SDK v3
  │       ├── Players, Teams, Tournaments, Matches, Turfs
  │       ├── Bookings, PlayerStats, Registrations, Leaderboards
  │       └── Operations: GetItem, PutItem, Query (GSI), UpdateItem, DeleteItem
  │
  ├──── Valkey/Redis ──── Slot Locking (SET NX EX 300)
  │       └── Prevents double-booking with atomic locks
  │
  ├──── EventBridge ──── PutEvents (7 event types)
  │       └── tournament.created, score.updated, booking.confirmed...
  │
  ├──── Amazon Bedrock ──── InvokeModel (Nova Micro)
  │       └── AI Coach reads PlayerStats from DynamoDB → generates insights
  │
  └──── OpenStreetMap ──── Map tiles (free, no API key)
```

> Open [`docs/reference.drawio`](./reference.drawio) in [draw.io](https://app.diagrams.net) for the full editable diagram.

---

## Key Features (Working in Production)

### 1. Real-Time Booking (Valkey + DynamoDB)

```
POST /api/turfs/:id/book
  → Valkey: EXISTS slot? → SET NX EX 300 (atomic lock)
  → DynamoDB: PutItem to Bookings table
  → Valkey: SET EX 86400 (mark booked 24h)
  → EventBridge: booking.confirmed event
```

Two users booking same slot simultaneously → only one gets the lock. Zero double-bookings.

### 2. Tournament CRUD (DynamoDB + EventBridge)

- **Create:** Organizer fills form → `POST /api/tournaments` → DynamoDB PutItem + EventBridge `tournament.created`
- **Register:** Player clicks "Join" → `POST /api/tournaments/:id/register` → DynamoDB PutItem (Registrations) + atomic `teamsJoined++`
- **Delete:** Organizer deletes → safety check (can't delete active) → DynamoDB DeleteItem

### 3. AI Coach (Amazon Bedrock Nova Micro)

```
POST /api/ai/coach
  → Query DynamoDB PlayerStats (real wins, goals, MVP count)
  → Build prompt with actual numbers
  → InvokeModel (us.amazon.nova-micro-v1:0)
  → Return: personalized tips, predictions, weekly goals
```

### 4. Live Match Scoring

- Football: goals, cards, substitutions (minute-by-minute)
- Cricket: runs, wickets, overs (ball-by-ball)
- DynamoDB `list_append`  adds events to array without overwriting
- EventBridge fires `score.updated` on every change

### 5. Maps & GPS

- OpenStreetMap + Leaflet (free, no API key)
- Nearby turfs (Haversine distance calculation)
- GPS check-in (200m geofence verification)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Generation | [Vercel v0](https://v0.dev) — AI-powered frontend code generation |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Framer Motion |
| Deployment | Vercel (auto-deploy from GitHub) |
| Database | Amazon DynamoDB (9 tables, 7 GSIs, PAY_PER_REQUEST) |
| Cache | Upstash Valkey/Redis (slot locking, rate limiting) |
| Events | Amazon EventBridge (7 event types) |
| AI | Amazon Bedrock (Nova Micro) |
| Maps | OpenStreetMap + Leaflet |

---

## DynamoDB Tables (9)

| Table | Key | GSIs | Used For |
|-------|-----|------|----------|
| Players | playerId | CityIndex | User profiles |
| Teams | teamId | CaptainIndex | Team management |
| Tournaments | tournamentId | SportStatusIndex | Tournament CRUD |
| Matches | matchId | TournamentIndex | Live scoring |
| Turfs | turfId | OwnerIndex | Turf listings |
| Bookings | bookingId | TurfIndex, UserIndex | Real-time booking |
| PlayerStats | playerId + sport | — | AI Coach input |
| Registrations | registrationId | TournamentIndex | Team registration |
| Leaderboards | partitionKey + playerId | — | Rankings |

---

## EventBridge Events (Verified Working)

CloudWatch shows **11+ events published** this week:

| Event | When |
|-------|------|
| `tournament.created` | Organizer creates tournament |
| `team.registered` | Team joins tournament |
| `match.started` | Match kicks off |
| `score.updated` | Live score change |
| `match.completed` | Match ends |
| `booking.confirmed` | Turf slot booked |
| `player.achievement` | Badge unlocked |

---

## Cost

| Service | Cost |
|---------|------|
| DynamoDB | $0 (free tier) |
| EventBridge | $0 (free tier) |
| Valkey/Redis | $0 (Upstash free tier) |
| Bedrock Nova Micro | ~$0.01/1K tokens |
| Vercel | $0 (Hobby plan) |
| OpenStreetMap | $0 |
| **Total** | **$0/month** |

---

## Test It

```bash
# API (direct — returns real DynamoDB data)
curl https://turf-arena-gilt.vercel.app/api/tournaments
curl https://turf-arena-gilt.vercel.app/api/tournaments/t1

# Login credentials
# Player:    customer@turf.com / customer123
# Organizer: organizer@turf.com / organizer123
# Owner:     owner@turf.com / owner123
```

---

## Team

- **Dineshraj Dhanapathy**
- **Abinaya SV**
- **Mariyam Usmani**

---

*Built for the **H0: Hack the Zero Stack with Vercel v0 and AWS Databases** hackathon.*

*Frontend generated with [Vercel v0](https://v0.dev)  AI-powered frontend generation. Describe what you want, v0 generates production-ready React/Next.js code with Tailwind CSS. Deploy to Vercel in one click.*

*Developed with [Kiro](https://kiro.dev)  AI-powered development environment.*
