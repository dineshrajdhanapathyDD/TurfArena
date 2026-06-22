# 🏟️ TurfArena – The Operating System for Local Sports Communities

> Join tournaments. Track performance. Build your sports identity.

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://vercel.com)
[![Database: DynamoDB](https://img.shields.io/badge/Database-Amazon%20DynamoDB-4053D6?logo=amazondynamodb)](https://aws.amazon.com/dynamodb/)
[![Events: EventBridge](https://img.shields.io/badge/Events-Amazon%20EventBridge-FF9900?logo=amazonaws)](https://aws.amazon.com/eventbridge/)

**Live Demo:** [turf-arena-gilt.vercel.app](https://turf-arena-gilt.vercel.app)

---

## Problem

Across India, thousands of football, cricket, badminton, volleyball, and basketball turfs host matches every weekend. Most tournaments are managed through WhatsApp groups, spreadsheets, or manual processes. There is no centralized platform for player statistics, rankings, tournament history, online registration, digital score tracking, or turf management.

## Solution

TurfArena connects players, team captains, tournament organizers, and turf owners in a single ecosystem — enabling tournament management, live score tracking, player profiles, rankings, analytics, and business tools for turf owners.

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
- **Match Analytics** – Sport-specific statistics with visual charts
- **Community Feed** – Social feed for match results, achievements, highlights with likes and comments
- **AI Coach** – Match predictions, performance insights, improvement tips
- **Turf Booking** – Search, filter, and book turfs with slot availability
- **Multi-Sport Support** – Football, cricket, basketball, volleyball, badminton

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Leaflet (OpenStreetMap) |
| Deployment | Vercel (serverless functions) |
| Database | Amazon DynamoDB (PAY_PER_REQUEST) |
| Cache | AWS ElastiCache Valkey (Redis-compatible, real-time slot locking) |
| Events | Amazon EventBridge |
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
- If another user tries to book the same slot simultaneously, they get `423 Locked`
- If booking fails, lock is released automatically

**Valkey operations used:**
| Operation | Purpose | TTL |
|-----------|---------|-----|
| `SET ... NX EX 300` | Acquire slot lock | 5 min |
| `SET ... EX 86400` | Mark slot as booked | 24 hours |
| `EXISTS` | Check if slot available | — |
| `GET` | Cached availability | 60 sec |
| `INCR + EXPIRE` | API rate limiting | 60 sec |

**Connection:** Upstash Redis (serverless, Valkey-compatible, us-east-1)

---

## Architecture

### Full System Architecture

```mermaid
graph TD
    subgraph Frontend["FRONTEND - Vercel"]
        UI[Next.js 16 - React 19 SSR]
        CDN[Vercel Edge CDN]
        MW[Auth Middleware - JWT]
        AN[Vercel Analytics + Speed Insights]
    end

    subgraph Backend["BACKEND - API Layer"]
        API[API Routes - 14 Serverless Functions]
        SDK[AWS SDK v3 - DynamoDB + EventBridge]
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

    subgraph Events["EVENTS - Amazon EventBridge"]
        EB[TurfArena-Events Bus]
        R1[Tournament Alerts Rule]
        R2[Live Score Push Rule]
        R3[Booking Confirmation Rule]
    end

    subgraph Future["PLANNED - Future Enhancements"]
        COG[Amazon Cognito - Auth]
        S3[S3 - Image Uploads]
        WS[API Gateway WebSocket - Real-time]
        CF[CloudFront - Global CDN]
        WAF[AWS WAF - Security]
        XR[AWS X-Ray - Tracing]
        CW[CloudWatch - Monitoring + Alarms]
    end

    UI -->|HTTPS + TLS 1.3| CDN
    CDN -->|Static Assets| UI
    UI -->|Internal Calls| API
    API -->|Read/Write| T1
    API -->|Read/Write| T2
    API -->|Read/Write| T3
    API -->|Read/Write| T4
    API -->|Read/Write| T5
    API -->|Read/Write| T6
    API -->|Read/Write| T7
    API -->|Read/Write| T8
    API -->|Read/Write| T9
    API -->|PutEvents| EB
    EB --> R1
    EB --> R2
    EB --> R3
```

### API Connection Map

```mermaid
graph LR
    subgraph Client["Client - Browser"]
        C1[Tournaments UI]
        C2[Live Match UI]
        C3[Turf Booking UI]
        C4[Player Profile UI]
        C5[Leaderboards UI]
    end

    subgraph APIs["API Routes - /api/*"]
        A1["/api/tournaments"]
        A2["/api/matches"]
        A3["/api/turfs"]
        A4["/api/players"]
        A5["/api/teams"]
    end

    subgraph DDB["DynamoDB Tables"]
        D1[(Tournaments)]
        D2[(Matches)]
        D3[(Turfs + Bookings)]
        D4[(Players + Stats)]
        D5[(Teams + Registrations)]
    end

    C1 --> A1
    C2 --> A2
    C3 --> A3
    C4 --> A4
    C5 --> A5

    A1 --> D1
    A2 --> D2
    A3 --> D3
    A4 --> D4
    A5 --> D5
```

### Well-Architected Design

| Pillar | Current Implementation | Planned Enhancement |
|--------|----------------------|---------------------|
| **Operational Excellence** | Vercel Analytics, structured API error handling, `AWS_ENABLED` feature flag for graceful degradation | AWS X-Ray tracing, CloudWatch Alarms, automated rollback |
| **Security** | HTTPS/TLS 1.3, role-based auth (4 roles), env vars in Vercel (never in code), input validation on all endpoints | Amazon Cognito (OIDC), AWS WAF, API rate limiting, DynamoDB encryption at rest |
| **Reliability** | Serverless auto-scaling (Vercel + DynamoDB on-demand), multi-AZ DynamoDB, EventBridge retry policies | DynamoDB Global Tables (multi-region), Circuit breaker pattern, health check endpoint |
| **Performance** | Vercel Edge CDN, DynamoDB single-digit ms latency, PAY_PER_REQUEST auto-scaling, Next.js SSR + static generation | DynamoDB DAX (caching), API Gateway WebSocket for live scores, CloudFront for images |
| **Cost Optimization** | PAY_PER_REQUEST (no idle cost), Vercel Hobby (free), EventBridge free tier (14M events), no provisioned capacity | Reserved capacity for production, S3 lifecycle policies, Lambda@Edge for compute |
| **Sustainability** | Serverless (no always-on servers), on-demand compute only when users are active | Right-size DynamoDB indexes, archive old match data to S3 Glacier |

### Security Architecture

```mermaid
graph TD
    subgraph Client
        BR[Browser]
    end

    subgraph Edge["Security Layer"]
        TLS[TLS 1.3 Encryption]
        AUTH[Role-based Auth Check]
        VAL[Input Validation]
    end

    subgraph Compute["Serverless - No Server to Patch"]
        FN[Vercel Functions - Auto-scale]
    end

    subgraph Data["Data Layer"]
        ENV[Env Vars - Encrypted at Rest]
        DDB[DynamoDB - Encryption at Rest]
        EB2[EventBridge - IAM Scoped]
    end

    BR -->|HTTPS Only| TLS
    TLS --> AUTH
    AUTH -->|Allowed Roles| VAL
    VAL -->|Sanitized Input| FN
    FN -->|IAM Credentials| DDB
    FN -->|IAM Credentials| EB2
    ENV -.->|Injected at Build| FN
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

    P1 --> EB3
    P2 --> EB3
    P3 --> EB3
    P4 --> EB3
    P5 --> EB3
    P6 --> EB3

    EB3 --> C6
    EB3 --> C7
    EB3 --> C8
    EB3 --> C9
```

### Tournament Flow

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

    O->>App: PATCH /api/matches/:id/score
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
        string city
        int ranking
        string role
    }
    TEAMS {
        string teamId PK
        string teamName
        string captainId
        string sport
    }
    TOURNAMENTS {
        string tournamentId PK
        string name
        string sport
        string format
        int prizePool
        int entryFee
    }
    MATCHES {
        string matchId PK
        string tournamentId
        string homeTeam
        string awayTeam
        int homeScore
        int awayScore
        string status
    }
    PLAYER_STATS {
        string playerId PK
        string sport
        int matchesPlayed
        int wins
        int mvpAwards
    }
    TURFS {
        string turfId PK
        string name
        string ownerId
        int pricePerHour
    }
    BOOKINGS {
        string bookingId PK
        string turfId
        string userId
        string date
        string slot
    }

    PLAYERS ||--o{ TEAMS : captains
    PLAYERS ||--o{ PLAYER_STATS : has
    PLAYERS ||--o{ BOOKINGS : books
    TOURNAMENTS ||--o{ MATCHES : contains
    TURFS ||--o{ BOOKINGS : has
```

### User Journeys

```mermaid
graph TD
    subgraph Player
        PA[Sign Up] --> PB[Join Team]
        PB --> PC[Register Tournament]
        PC --> PD[Play Matches]
        PD --> PE[View Stats]
        PE --> PF[AI Insights]
    end
```

```mermaid
graph TD
    subgraph Organizer
        OA[Create Tournament] --> OB[Set Rules]
        OB --> OC[Open Registration]
        OC --> OD[Generate Brackets]
        OD --> OE[Manage Scores]
        OE --> OF[Publish Results]
    end
```

```mermaid
graph TD
    subgraph Owner
        TA[Register Turf] --> TB[Set Slots]
        TB --> TC[Receive Bookings]
        TC --> TD[Host Events]
        TD --> TE[Track Revenue]
    end
```

### Feature Overview

```mermaid
graph TD
    TA((TurfArena)) --> TM[Tournament Management]
    TA --> LS[Live Scoring]
    TA --> PS[Player System]
    TA --> RK[Rankings]
    TA --> AI[AI Features]
    TA --> TB[Turf Booking]
    TA --> CM[Community]

    TM --> TM1[Knockout / League / Group]
    TM --> TM2[Auto Brackets]
    TM --> TM3[Team Registration]

    LS --> LS1[Football - Goals Cards]
    LS --> LS2[Cricket - Runs Wickets]
    LS --> LS3[Match Events Timeline]

    PS --> PS1[Profiles and Stats]
    PS --> PS2[Achievements]
    PS --> PS3[Performance Charts]

    RK --> RK1[Weekly / Monthly / All-Time]
    RK --> RK2[City Rankings]

    AI --> AI1[Match Predictions]
    AI --> AI2[Performance Coach]
    AI --> AI3[Team Builder]

    TB --> TB1[Search and Filter]
    TB --> TB2[Slot Availability]
    TB --> TB3[Reviews and Ratings]

    CM --> CM1[Social Feed]
    CM --> CM2[Likes and Comments]
```

### Draw.io Diagrams

For detailed editable diagrams, open in [draw.io](https://app.diagrams.net):

- [`docs/architecture.drawio`](./docs/architecture.drawio) — **Well-Architected System Architecture** showing Frontend, Backend APIs, Database, Events, Security layer, Observability, and Planned enhancements mapped to all 6 AWS Well-Architected pillars
- [`docs/tournament-flow.drawio`](./docs/tournament-flow.drawio) — Tournament lifecycle sequence diagram

---

## 📁 Repository Structure

```
.
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Splash / landing page
│   ├── layout.tsx                    # Root layout with AuthProvider + BackButton
│   ├── globals.css                   # Tailwind + CSS variables + utilities
│   ├── auth/                         # Login page
│   ├── onboarding/                   # 3-step onboarding wizard
│   ├── home/                         # Role-based redirect hub
│   ├── customer-dashboard/           # Player dashboard
│   ├── discover/                     # Tournament discovery + sport filters
│   ├── community/                    # Social feed (posts, likes, comments)
│   ├── leaderboards/                 # Rankings with podium view
│   ├── live/                         # Live match center (football + cricket)
│   ├── ai/                           # AI Coach chat + match predictions
│   ├── profile/                      # Player profile + achievements
│   ├── stats/                        # Player statistics + charts
│   ├── team/                         # Team management + formation
│   ├── tournaments/                  # Tournament listing + detail
│   │   └── [id]/
│   │       ├── page.tsx              # Tournament detail (tabs)
│   │       └── register/             # Team registration wizard
│   ├── turfs/                        # Turf listing + detail
│   │   └── [id]/                     # Turf detail + booking
│   ├── turfs-explore/                # Turf search (customer)
│   ├── my-bookings/                  # User's bookings
│   ├── notifications/                # Notification center
│   ├── settings/                     # User settings
│   ├── organizer/                    # Organizer dashboard + sub-pages
│   ├── owner/                        # Turf owner dashboard + sub-pages
│   └── api/                          # REST API endpoints
│       ├── tournaments/              # CRUD + register
│       ├── matches/                  # CRUD + live score
│       ├── players/                  # List + stats
│       ├── teams/                    # CRUD
│       └── turfs/                    # List + book
├── components/                       # Shared UI components
│   ├── app-shell.tsx                 # Responsive page wrapper
│   ├── back-button.tsx               # Global back navigation
│   ├── bottom-nav.tsx                # Mobile bottom navigation
│   ├── sidebar.tsx                   # Role-based sidebar
│   └── ...                           # Cards, layouts, etc.
├── lib/                              # Utilities + services
│   ├── data.ts                       # Mock data + types
│   ├── auth-context.tsx              # Auth provider (4 roles)
│   ├── utils.ts                      # Tailwind helper
│   └── aws/                          # AWS service layer
│       ├── config.ts                 # AWS_ENABLED flag
│       ├── dynamodb.ts               # DynamoDB client + CRUD
│       ├── eventbridge.ts            # Event publisher
│       └── tables.ts                 # Table schemas + types
├── scripts/                          # Infrastructure scripts
│   ├── setup-aws.ts                  # Creates DynamoDB tables + EventBridge
│   └── seed-aws.ts                   # Seeds demo data
├── docs/                             # Editable diagrams
│   ├── architecture.drawio           # System architecture
│   └── tournament-flow.drawio        # Tournament flow
├── public/                           # Static assets + images
├── .env.example                      # Environment variable template
├── .gitignore                        # Git ignore rules
├── vercel.json                       # Vercel build configuration
├── AWS_SETUP.md                      # AWS integration guide
├── TROUBLESHOOTING.md                # Common issues + solutions
├── next.config.mjs                   # Next.js config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies + scripts
└── README.md                         # This file
```

---

## 🚀 Getting Started

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

## ☁️ AWS Integration

### Quick Setup

```bash
# 1. Fill in .env.local with your credentials
#    AWS_REGION=us-east-1
#    AWS_ACCESS_KEY_ID=your-key
#    AWS_SECRET_ACCESS_KEY=your-secret
#    VALKEY_URL=rediss://default:xxx@your-host.upstash.io:6379

# 2. Create DynamoDB tables + EventBridge bus + seed data
npm run aws:init

# 3. Start app (now connected to DynamoDB + Valkey)
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

See [AWS_SETUP.md](./AWS_SETUP.md) for full details, IAM policies, and deployment steps.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tournaments` | List tournaments (filter: sport, city, status) |
| POST | `/api/tournaments` | Create tournament |
| GET | `/api/tournaments/:id` | Tournament details |
| PATCH | `/api/tournaments/:id` | Update tournament |
| POST | `/api/tournaments/:id/register` | Register team |
| GET | `/api/matches` | List matches (filter: status, tournamentId) |
| POST | `/api/matches` | Create match |
| PATCH | `/api/matches/:id/score` | Update live score |
| GET | `/api/players` | List players (filter: city) |
| GET | `/api/players/:id/stats` | Player stats per sport |
| GET | `/api/teams` | List teams (filter: captainId, sport) |
| POST | `/api/teams` | Create team |
| GET | `/api/turfs` | List turfs (filter: sport, area, maxPrice) |
| GET | `/api/turfs/:id` | Turf details |
| GET | `/api/turfs/:id/availability` | Real-time slot availability (Valkey cached) |
| POST | `/api/turfs/:id/book` | Book a slot (with Valkey lock) |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run aws:setup` | Create DynamoDB tables + EventBridge bus |
| `npm run aws:seed` | Populate tables with demo data |
| `npm run aws:init` | Setup + seed in one command |

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add environment variables:
   - `AWS_REGION` = `us-east-1`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `EVENTBRIDGE_BUS_NAME` = `TurfArena-Events`
   - `VALKEY_URL` = `rediss://default:xxx@your-host.upstash.io:6379`
4. Deploy

---

## Monetization

- Premium Player Profiles with advanced analytics and AI-generated performance reports
- Subscription plans for turf owners
- Pay-per-tournament tools for organizers

---

## AI Features

- **AI Match Insights** – Post-match analysis and key moments
- **AI Team Builder** – Suggest optimal team compositions
- **AI Tournament Predictor** – Predict outcomes based on team stats
- **AI Performance Coach** – Personalized improvement tips

---

## Cost Estimate

| Service | Cost |
|---------|------|
| DynamoDB (PAY_PER_REQUEST) | ~$0 (free tier covers 25 RCU + 25 WCU) |
| EventBridge | ~$0 (14M events/month free) |
| Valkey / Upstash Redis | ~$0 (10K commands/day free) |
| Vercel (Hobby) | Free |
| OpenStreetMap | Free (no API key) |
| **Total** | **Free for development and demos** |

---

## License

MIT — see [LICENSE](./LICENSE)
