# TurfArena

> The Operating System for Local Sports Communities — Join tournaments. Track performance. Build your sports identity.

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://vercel.com)
[![Database: DynamoDB](https://img.shields.io/badge/Database-Amazon%20DynamoDB-4053D6?logo=amazondynamodb)](https://aws.amazon.com/dynamodb/)
[![AI: Amazon Bedrock](https://img.shields.io/badge/AI-Amazon%20Bedrock-FF9900?logo=amazonaws)](https://aws.amazon.com/bedrock/)
[![Cache: Valkey](https://img.shields.io/badge/Cache-Valkey%2FRedis-DC382D?logo=redis)](https://valkey.io/)
[![Events: EventBridge](https://img.shields.io/badge/Events-Amazon%20EventBridge-FF9900?logo=amazonaws)](https://aws.amazon.com/eventbridge/)

**Live Demo:** [turf-arena-gilt.vercel.app](https://turf-arena-gilt.vercel.app)

---

## Problem

Across India, thousands of football, cricket, badminton, volleyball, and basketball turfs host matches every weekend. Most tournaments are managed through WhatsApp groups, spreadsheets, or manual processes. There is no centralized platform for player statistics, rankings, tournament history, online registration, digital score tracking, or turf management.

## Solution

TurfArena connects players, team captains, tournament organizers, and turf owners in a single ecosystem — enabling tournament management, live score tracking, player profiles, rankings, AI coaching, real-time booking, and business tools for turf owners.

---

## Target Users

| Role | Description |
|------|-------------|
| **Players** | Join tournaments, track performance, build sports profiles |
| **Team Captains** | Manage teams and lineups |
| **Tournament Organizers** | Create and run competitions |
| **Turf Owners** | Manage bookings and host events |

---

## Core Features

- **Tournament Management** – Knockout, league, and group-stage formats with bracket generation
- **Real-Time Score Updates** – Live scoring for football (goals, cards) and cricket (runs, wickets, overs)
- **Player Profiles** – Matches played, win rates, achievements, performance history
- **Global Rankings** – Leaderboards for players, teams, and turfs (weekly/monthly/all-time)
- **AI Coach (Amazon Bedrock)** – Match predictions, performance insights, improvement tips, team builder
- **Real-Time Booking (Valkey)** – Slot locking prevents double-booking with atomic Redis operations
- **Turf Booking** – Search, filter, and book turfs with live slot availability
- **Community Feed** – Social feed for match results, achievements, highlights with likes and comments
- **Maps & Location** – OpenStreetMap + Leaflet with GPS check-in (200m geofencing)
- **Multi-Sport Support** – Football, cricket, basketball, volleyball, badminton

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Leaflet (OpenStreetMap) |
| Deployment | Vercel (serverless functions + Edge CDN) |
| Database | Amazon DynamoDB (9 tables, PAY_PER_REQUEST, 7 GSIs) |
| Cache | Upstash Valkey/Redis (real-time slot locking) |
| Events | Amazon EventBridge (7 event types) |
| AI | Amazon Bedrock (Nova Micro - `us.amazon.nova-micro-v1:0`) |
| Maps | OpenStreetMap + Leaflet (free, no API key) |
| UI Components | shadcn/ui, Lucide React icons |
| Auth | Role-based (4 roles: player, captain, organizer, owner) |

---

## Real-Time Booking (Valkey/Redis)

TurfArena uses **Valkey** (Redis-compatible cache) for real-time slot management:

```mermaid
sequenceDiagram
    participant U as User
    participant API as Booking API
    participant V as Valkey Cache
    participant DB as DynamoDB

    U->>API: POST /api/turfs/:id/book
    API->>V: isSlotBooked? (instant check)
    V-->>API: No
    API->>V: lockSlot (5 min TTL, NX)
    V-->>API: Lock acquired
    API->>DB: PutItem (Bookings table)
    DB-->>API: Success
    API->>V: markSlotBooked (24h TTL)
    API-->>U: 201 Booking Confirmed
```

**How it prevents double-booking:**
- `SET key NX EX 300` — atomic lock, only one user can hold it
- If another user tries the same slot simultaneously, they get `423 Locked`
- If booking fails, lock is released automatically

**Valkey operations used:**
| Operation | Purpose | TTL |
|-----------|---------|-----|
| `SET ... NX EX 300` | Acquire slot lock | 5 min |
| `SET ... EX 86400` | Mark slot as booked | 24 hours |
| `EXISTS` | Check if slot available | — |
| `GET` | Cached availability | 60 sec |
| `INCR + EXPIRE` | API rate limiting | 60 sec |

---

## AI Features (Amazon Bedrock)

TurfArena integrates **Amazon Bedrock Nova Micro** for intelligent sports insights:

```mermaid
graph LR
    subgraph Input["Data Sources"]
        PS[(PlayerStats - DynamoDB)]
        MH[(Match History)]
    end

    subgraph Bedrock["Amazon Bedrock"]
        NM[Nova Micro Model]
    end

    subgraph Output["AI Outputs"]
        CO[AI Coach - Tips]
        PR[Match Predictions]
        TB[Team Builder]
        CM[Match Commentary]
        RP[Performance Report]
    end

    PS --> NM
    MH --> NM
    NM --> CO
    NM --> PR
    NM --> TB
    NM --> CM
    NM --> RP
```

| Feature | What it does |
|---------|-------------|
| **AI Coach** | Personalized training drills with estimated improvement % |
| **Match Prediction** | Win probability from real stats (DynamoDB PlayerStats) |
| **Team Builder** | Optimal formations and chemistry scoring |
| **Commentary** | Auto-generated match narrative from live events |
| **Performance Report** | Strengths, weaknesses, weekly goals |

---

## Architecture

### Full System Architecture

<!--![TurfArena Architecture v4](./docs/screenshots/turfarena-architecture-v4.gif)-->
![turfarena architecture v4.gif](https://images.tomarkdown.dev/uploaded/61zc54xsu8wnxxki.gif)

> *Animated architecture diagram showing data flow across all AWS services. Open [`docs/architecture.drawio`](./docs/architecture.drawio) in draw.io for the editable version.*

```mermaid
graph TD
    subgraph Frontend["FRONTEND - Vercel"]
        UI[Next.js 16 - React 19 SSR]
        CDN[Vercel Edge CDN]
        MW[Auth Middleware - Role-based]
        AN[Vercel Analytics + Speed Insights]
    end

    subgraph Backend["BACKEND - API Layer"]
        API[22 Serverless API Routes]
        SDK[AWS SDK v3 - DynamoDB + EventBridge + Bedrock]
    end

    subgraph Cache["CACHE - Valkey"]
        VK[Upstash Redis - Slot Locking]
    end

    subgraph Database["DATABASE - Amazon DynamoDB"]
        T1[(Players)]
        T2[(Teams)]
        T3[(Tournaments)]
        T4[(Matches)]
        T5[(Turfs)]
        T6[(Bookings)]
        T7[(PlayerStats)]
        T8[(Leaderboards)]
        T9[(Registrations)]
    end

    subgraph AI["AI - Amazon Bedrock"]
        BK[Nova Micro Model]
    end

    subgraph Events["EVENTS - Amazon EventBridge"]
        EB[TurfArena-Events Bus]
        R1[Tournament Alerts]
        R2[Live Score Push]
        R3[Booking Confirmation]
    end

    UI -->|HTTPS + TLS 1.3| CDN
    CDN -->|Static Assets| UI
    UI -->|Internal Calls| API
    API -->|Read/Write| T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9
    API -->|Lock/Cache| VK
    API -->|InvokeModel| BK
    API -->|PutEvents| EB
    EB --> R1 & R2 & R3
```

### Event-Driven Architecture

```mermaid
graph LR
    subgraph Producers["Event Producers"]
        P1[Tournament Created]
        P2[Team Registered]
        P3[Score Updated]
        P4[Match Completed]
        P5[Booking Confirmed]
        P6[Achievement Unlocked]
    end

    subgraph Bus["EventBridge Bus"]
        EB3[TurfArena-Events]
    end

    subgraph Consumers["Event Consumers - Planned"]
        C6[SNS - Push Notifications]
        C7[SQS - Email Queue]
        C8[Lambda - Leaderboard Recalc]
        C9[Lambda - Analytics Aggregation]
    end

    P1 & P2 & P3 & P4 & P5 & P6 --> EB3
    EB3 --> C6 & C7 & C8 & C9
```

### Tournament Flow

<!--![Tournament Flow v2](./docs/screenshots/tournament-flow-v2.png)-->
![tournament flow v2.drawio.png](https://images.tomarkdown.dev/uploaded/ozh20atltydnxzf0.png)

> *Complete tournament lifecycle: Create → Register → Live Score → Results. Open [`docs/tournament-flow.drawio`](./docs/tournament-flow.drawio) for editable version.*

```mermaid
sequenceDiagram
    participant O as Organizer
    participant App as TurfArena API
    participant DB as DynamoDB
    participant EB as EventBridge
    participant P as Players

    O->>App: POST /api/tournaments
    App->>DB: PutItem (Tournaments)
    App->>EB: tournament.created
    EB-->>P: New Tournament Notification

    P->>App: POST /api/tournaments/:id/register
    App->>DB: PutItem (Registrations)
    App->>DB: UpdateItem (teamsJoined++)
    App->>EB: team.registered
    EB-->>O: Team Registered Alert

    O->>App: POST /api/matches
    App->>DB: PutItem (Matches)
    App->>EB: match.started

    loop Live Match
        O->>App: PATCH /api/matches/:id/score
        App->>DB: UpdateItem (score + events)
        App->>EB: score.updated
        EB-->>P: Live Score Push
    end

    O->>App: PATCH /api/matches/:id/score (final)
    App->>DB: Store Final Results
    App->>EB: match.completed
    EB-->>P: Match Result Notification
```

### Data Model

```mermaid
erDiagram
    PLAYERS {
        string playerId PK
        string name
        string email
        string city
        int ranking
        string role
        string avatar
    }
    TEAMS {
        string teamId PK
        string teamName
        string captainId
        string sport
        string city
        int wins
        int losses
    }
    TOURNAMENTS {
        string tournamentId PK
        string name
        string sport
        string format
        string status
        int prizePool
        int entryFee
        int teamsJoined
        int totalSpots
        string organizerId
    }
    MATCHES {
        string matchId PK
        string tournamentId FK
        string homeTeam
        string awayTeam
        int homeScore
        int awayScore
        string status
        string sport
    }
    PLAYER_STATS {
        string playerId PK
        string sport SK
        int matchesPlayed
        int wins
        int losses
        int goals
        int assists
        int mvpAwards
    }
    TURFS {
        string turfId PK
        string name
        string ownerId
        string area
        string city
        int pricePerHour
        float rating
    }
    BOOKINGS {
        string bookingId PK
        string turfId FK
        string userId FK
        string date
        string slot
        string status
        int amount
    }
    REGISTRATIONS {
        string registrationId PK
        string tournamentId FK
        string teamId
        string teamName
        string captainId
        string status
    }
    LEADERBOARDS {
        string partitionKey PK
        string playerId SK
        int points
        int rank
    }

    PLAYERS ||--o{ TEAMS : captains
    PLAYERS ||--o{ PLAYER_STATS : has_stats
    PLAYERS ||--o{ BOOKINGS : makes
    TOURNAMENTS ||--o{ MATCHES : contains
    TOURNAMENTS ||--o{ REGISTRATIONS : has_registrations
    TURFS ||--o{ BOOKINGS : receives
    TEAMS ||--o{ REGISTRATIONS : registers
```

### User Journeys

```mermaid
graph TD
    subgraph Player
        PA[Sign Up] --> PB[Join Team]
        PB --> PC[Register Tournament]
        PC --> PD[Play Matches]
        PD --> PE[View Stats]
        PE --> PF[AI Coach Insights]
    end
```

```mermaid
graph TD
    subgraph Organizer
        OA[Create Tournament] --> OB[Set Rules]
        OB --> OC[Open Registration]
        OC --> OD[Generate Brackets]
        OD --> OE[Manage Live Scores]
        OE --> OF[Publish Results]
    end
```

```mermaid
graph TD
    subgraph Owner
        TA[Register Turf] --> TB[Set Slots and Prices]
        TB --> TC[Receive Bookings via Valkey]
        TC --> TD[Host Events]
        TD --> TE[Track Revenue]
    end
```

### Well-Architected Design

| Pillar | Current Implementation | Planned Enhancement |
|--------|----------------------|---------------------|
| **Operational Excellence** | Vercel Analytics, structured logging, `AWS_ENABLED` feature flag, graceful degradation | AWS X-Ray tracing, CloudWatch Alarms |
| **Security** | HTTPS/TLS 1.3, RBAC (4 roles), encrypted env vars, input validation, IAM least privilege | Amazon Cognito, AWS WAF, rate limiting |
| **Reliability** | Serverless auto-scaling, multi-AZ DynamoDB, EventBridge retry, dual-mode fallback | DynamoDB Global Tables, circuit breaker |
| **Performance** | Edge CDN, DynamoDB <5ms latency, Valkey caching, SSR + static generation | DynamoDB DAX, WebSocket live scores |
| **Cost Optimization** | PAY_PER_REQUEST (no idle cost), Vercel Hobby (free), free tier coverage | Reserved capacity for production |
| **Sustainability** | Serverless (no always-on servers), on-demand compute only | Archive old data to S3 Glacier |

---

## Repository Structure

```
TurfArena/
├── app/                              # Next.js App Router (44 pages)
│   ├── page.tsx                      # Splash / landing page
│   ├── layout.tsx                    # Root layout + Auth + BackButton
│   ├── globals.css                   # Tailwind + dark theme CSS vars
│   ├── ai/                           # AI Coach chat page
│   ├── auth/                         # Login page (4 roles)
│   ├── community/                    # Social feed
│   ├── customer-dashboard/           # Player dashboard
│   ├── discover/                     # Tournament discovery
│   ├── home/                         # Role-based redirect
│   ├── leaderboards/                 # Rankings with podium
│   ├── live/                         # Live match center
│   ├── my-bookings/                  # User's bookings
│   ├── notifications/                # Notification center
│   ├── onboarding/                   # 3-step onboarding
│   ├── organizer/                    # Organizer dashboard
│   ├── owner/                        # Turf owner dashboard
│   ├── profile/                      # Player profile
│   ├── settings/                     # User settings
│   ├── stats/                        # Player statistics
│   ├── team/                         # Team management
│   ├── tournaments/                  # Tournaments + [id] detail
│   ├── turfs/                        # Turfs + [id] detail + booking
│   ├── turfs-explore/                # Turf search
│   └── api/                          # 22 REST API endpoints
│       ├── ai/                       # AI coach, insights
│       ├── auth/                     # Login, session validation
│       ├── bookings/                 # List, cancel
│       ├── location/                 # Nearby, live GPS, check-in
│       ├── matches/                  # CRUD + live score
│       ├── players/                  # List + stats
│       ├── teams/                    # CRUD
│       ├── tournaments/              # CRUD + register + delete
│       └── turfs/                    # List + book + availability
├── components/                       # Shared UI components
│   ├── ai-insight-card.tsx           # AI insight embed cards
│   ├── app-shell.tsx                 # Responsive page wrapper
│   ├── back-button.tsx               # Global back navigation
│   ├── bottom-nav.tsx                # Mobile bottom nav (AI Coach)
│   ├── map-view.tsx                  # Leaflet map component
│   ├── sidebar.tsx                   # Role-based sidebar
│   └── ui/                           # shadcn/ui components
├── lib/                              # Utilities + services
│   ├── auth-context.tsx              # Auth provider (4 roles)
│   ├── data.ts                       # Mock data + types
│   ├── utils.ts                      # Tailwind helper
│   └── aws/                          # AWS service layer
│       ├── bedrock.ts                # Amazon Bedrock AI client
│       ├── config.ts                 # AWS_ENABLED feature flag
│       ├── dynamodb.ts               # DynamoDB CRUD helpers
│       ├── eventbridge.ts            # Event publisher
│       ├── tables.ts                 # Table schemas + types
│       ├── valkey.ts                 # Valkey/Redis slot locking
│       └── index.ts                  # Barrel export
├── scripts/                          # Infrastructure scripts
│   ├── setup-aws.ts                  # Creates DynamoDB tables + EventBridge
│   ├── seed-aws.ts                   # Seeds demo data
│   └── test-bedrock.ts              # Test Bedrock AI connection
├── docs/                             # Documentation
│   ├── ABOUT_PROJECT.md              # Hackathon story + screenshots
│   ├── AWS_SETUP.md                  # AWS integration guide
│   ├── DYNAMODB_AND_OBSERVABILITY.md # DB operations + monitoring
│   ├── PERFORMANCE_OPTIMIZATIONS.md  # Performance tuning
│   ├── TROUBLESHOOTING.md            # Common issues + fixes
│   ├── architecture.drawio           # System architecture (editable)
│   ├── tournament-flow.drawio        # Tournament lifecycle
│   └── screenshots/                  # UI screenshots
├── public/                           # Static assets + images
├── .env.example                      # Environment variable template
├── vercel.json                       # Vercel build configuration
├── package.json                      # Dependencies + scripts
├── tsconfig.json                     # TypeScript config
└── README.md                         # This file
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- AWS account (optional — app works without it using mock data)

### Installation

```bash
git clone https://github.com/dineshrajdhanapathyDD/TurfArena.git
cd TurfArena
npm install
```

### Run Locally (no AWS needed)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app uses mock data when `AWS_REGION` is not set.

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Player | customer@turf.com | customer123 |
| Captain | captain@turf.com | captain123 |
| Organizer | organizer@turf.com | organizer123 |
| Turf Owner | owner@turf.com | owner123 |

---

## AWS Integration

### Quick Setup

```bash
# 1. Configure credentials in .env.local
#    AWS_REGION=us-east-1
#    AWS_ACCESS_KEY_ID=your-key
#    AWS_SECRET_ACCESS_KEY=your-secret
#    VALKEY_URL=rediss://default:xxx@your-host.upstash.io:6379

# 2. Create all AWS resources + seed demo data
npm run aws:init

# 3. Start app (connected to DynamoDB + Valkey + Bedrock)
npm run dev
```

### DynamoDB Tables (9 tables, PAY_PER_REQUEST)

| Table | Primary Key | GSIs |
|-------|-------------|------|
| TurfArena_Players | `playerId` | CityIndex |
| TurfArena_Teams | `teamId` | CaptainIndex |
| TurfArena_Tournaments | `tournamentId` | SportStatusIndex |
| TurfArena_Turfs | `turfId` | OwnerIndex |
| TurfArena_PlayerStats | `playerId` + `sport` | — |
| TurfArena_Matches | `matchId` | TournamentIndex |
| TurfArena_Bookings | `bookingId` | TurfIndex, UserIndex |
| TurfArena_Registrations | `registrationId` | TournamentIndex |
| TurfArena_Leaderboards | `partitionKey` + `playerId` | — |

### EventBridge Events

| Event | Trigger |
|-------|---------|
| `tournament.created` | New tournament created |
| `team.registered` | Team joins tournament |
| `match.started` | Match begins |
| `score.updated` | Live score change |
| `match.completed` | Match finishes |
| `booking.confirmed` | Turf slot booked |
| `player.achievement` | Achievement unlocked |

For full details, IAM policies, and deployment steps, see [docs/AWS_SETUP.md](./docs/AWS_SETUP.md).

---

## API Endpoints (22)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/auth/me` | Validate session token |
| GET | `/api/tournaments` | List tournaments (filter: sport, city, status) |
| POST | `/api/tournaments` | Create tournament |
| GET | `/api/tournaments/:id` | Tournament details |
| PATCH | `/api/tournaments/:id` | Update tournament |
| DELETE | `/api/tournaments/:id/delete` | Delete tournament |
| POST | `/api/tournaments/:id/register` | Register team |
| GET | `/api/matches` | List matches (filter: status, tournamentId) |
| POST | `/api/matches` | Create match |
| PATCH | `/api/matches/:id/score` | Update live score |
| GET | `/api/players` | List players (filter: city) |
| GET | `/api/players/:id/stats` | Player stats per sport |
| GET | `/api/teams` | List teams (filter: captainId, sport) |
| POST | `/api/teams` | Create team |
| GET | `/api/turfs` | List turfs (filter: sport, area, maxPrice) |
| GET | `/api/turfs/:id/availability` | Real-time slot availability (Valkey) |
| POST | `/api/turfs/:id/book` | Book a slot (Valkey lock) |
| POST | `/api/bookings/:id/cancel` | Cancel booking |
| GET | `/api/location/nearby-turfs` | Find turfs by GPS radius |
| POST | `/api/location/live` | Store live player GPS |
| POST | `/api/ai/coach` | AI coaching insights (Bedrock) |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (webpack) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run aws:setup` | Create DynamoDB tables + EventBridge bus |
| `npm run aws:seed` | Populate tables with demo data |
| `npm run aws:init` | Setup + seed in one command |

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set Framework Preset to **Next.js**
4. Add environment variables:
   - `AWS_REGION` = `us-east-1`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `EVENTBRIDGE_BUS_NAME` = `TurfArena-Events`
   - `VALKEY_URL` = `rediss://default:xxx@your-host.upstash.io:6379`
5. Deploy

---

## Cost Estimate

| Service | Cost |
|---------|------|
| DynamoDB (PAY_PER_REQUEST) | ~$0 (free tier: 25 RCU + 25 WCU) |
| EventBridge | ~$0 (14M events/month free) |
| Valkey / Upstash Redis | ~$0 (10K commands/day free) |
| Amazon Bedrock (Nova Micro) | ~$0.01 per 1K tokens |
| Vercel (Hobby) | Free |
| OpenStreetMap | Free (no API key) |
| **Total** | **Free for development and demos** |

---

## Documentation

| Document | Description |
|----------|-------------|
| [About the Project](./docs/ABOUT_PROJECT.md) | Hackathon story, inspiration, challenges, accomplishments |
| [Feature Showcase](./docs/FEATURE_SHOWCASE.md) | Complete feature walkthrough with screenshot references |
| [AWS Setup Guide](./docs/AWS_SETUP.md) | DynamoDB + EventBridge integration walkthrough |
| [Setup Guide](./docs/SETUP_GUIDE.md) | Quick start local development guide |
| [DynamoDB & Observability](./docs/DYNAMODB_AND_OBSERVABILITY.md) | Database operations, CloudWatch metrics, monitoring |
| [Performance Optimizations](./docs/PERFORMANCE_OPTIMIZATIONS.md) | Bundle optimization, caching, build improvements |
| [Troubleshooting](./docs/TROUBLESHOOTING.md) | Common issues and solutions |
| [Architecture Diagram](./docs/architecture.drawio) | Editable draw.io system architecture (v4) |
| [Tournament Flow](./docs/tournament-flow.drawio) | Tournament + booking + AI flow diagram (v2) |

### Diagram Assets

| File | Format | Description |
|------|--------|-------------|
| `docs/screenshots/turfarena-architecture-v4.gif` | GIF | Animated system architecture showing data flow |
| `docs/screenshots/tournament-flow-v2.png` | PNG | Tournament lifecycle: Create → Register → Score → Results |

> **How to generate these images:**
> 1. Open `docs/architecture.drawio` in [draw.io](https://app.diagrams.net)
> 2. Export as GIF (animated) → save as `docs/screenshots/turfarena-architecture-v4.gif`
> 3. Open `docs/tournament-flow.drawio` in draw.io
> 4. Export as PNG → save as `docs/screenshots/tournament-flow-v2.png`

---

## License

MIT
