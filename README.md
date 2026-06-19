# 🏟️ TurfArena – The Operating System for Local Sports Communities

> Join tournaments. Track performance. Build your sports identity.

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://vercel.com)
[![Database: DynamoDB](https://img.shields.io/badge/Database-Amazon%20DynamoDB-4053D6?logo=amazondynamodb)](https://aws.amazon.com/dynamodb/)
[![Events: EventBridge](https://img.shields.io/badge/Events-Amazon%20EventBridge-FF9900?logo=amazonaws)](https://aws.amazon.com/eventbridge/)

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
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Framer Motion |
| Deployment | Vercel (serverless functions) |
| Database | Amazon DynamoDB (PAY_PER_REQUEST) |
| Events | Amazon EventBridge |
| UI Components | shadcn/ui, Lucide React icons |
| Auth | Role-based (4 roles: player, captain, organizer, owner) |

---

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph Clients["🖥️ Clients"]
        B[Web Browser / Mobile PWA]
    end

    subgraph Vercel["▲ Vercel Platform"]
        FE[Next.js 16 Frontend<br/>SSR + Static Pages]
        API[API Routes<br/>Serverless Functions]
        CDN[Edge CDN<br/>Static Assets]
    end

    subgraph AWS["☁️ AWS Cloud - us-east-1"]
        subgraph Database["Amazon DynamoDB"]
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
        EB[Amazon EventBridge<br/>TurfArena-Events Bus]
        subgraph Notifications["Event Targets"]
            N1[Tournament Alerts]
            N2[Live Score Push]
            N3[Booking Confirmations]
        end
    end

    B -->|HTTPS| FE
    B -->|HTTPS| CDN
    FE -->|Internal| API
    API -->|Read/Write| Database
    API -->|PutEvents| EB
    EB --> N1 & N2 & N3
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

    O->>App: PATCH /api/matches/:id/score (status=completed)
    App->>DB: UpdateItem (final result)
    App->>DB: UpdateItem (PlayerStats)
    App->>EB: match.completed
    EB-->>P: Match Result Notification
```

### Data Model (DynamoDB)

```mermaid
erDiagram
    PLAYERS {
        string playerId PK
        string name
        string email
        string city
        int ranking
        string role
        int credits
    }
    TEAMS {
        string teamId PK
        string teamName
        string captainId FK
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
        string organizerId FK
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
        int goals
        int assists
        int mvpAwards
    }
    TURFS {
        string turfId PK
        string name
        string ownerId FK
        string area
        int pricePerHour
        float rating
    }
    BOOKINGS {
        string bookingId PK
        string turfId FK
        string userId FK
        string date
        string slot
        int amount
        string status
    }
    REGISTRATIONS {
        string registrationId PK
        string tournamentId FK
        string teamId FK
        string captainId
        string status
    }
    LEADERBOARDS {
        string partitionKey PK
        string playerId SK
        int points
        int matches
        string badge
    }

    PLAYERS ||--o{ TEAMS : "captains"
    PLAYERS ||--o{ PLAYER_STATS : "has stats"
    PLAYERS ||--o{ BOOKINGS : "books"
    TEAMS }o--o{ TOURNAMENTS : "registers via"
    TOURNAMENTS ||--o{ MATCHES : "contains"
    TOURNAMENTS ||--o{ REGISTRATIONS : "has"
    TURFS ||--o{ BOOKINGS : "has slots"
    MATCHES }o--|| TEAMS : "homeTeam"
    MATCHES }o--|| TEAMS : "awayTeam"
```

### User Journeys

```mermaid
flowchart LR
    subgraph Player["⚽ Player Journey"]
        P1[Sign Up] --> P2[Join Team]
        P2 --> P3[Register for Tournament]
        P3 --> P4[Play Matches]
        P4 --> P5[View Stats & Rankings]
        P5 --> P6[AI Coach Insights]
    end

    subgraph Organizer["🏆 Organizer Journey"]
        O1[Create Tournament] --> O2[Set Format & Rules]
        O2 --> O3[Open Registrations]
        O3 --> O4[Generate Brackets]
        O4 --> O5[Manage Live Scores]
        O5 --> O6[Publish Results]
    end

    subgraph Owner["🏟️ Turf Owner Journey"]
        T1[Register Turf] --> T2[Set Availability]
        T2 --> T3[Receive Bookings]
        T3 --> T4[Host Tournaments]
        T4 --> T5[Track Revenue]
    end
```

### Feature Map

```mermaid
mindmap
  root((TurfArena))
    Tournament Management
      Knockout Format
      League Format
      Group Stage
      Auto Brackets
      Team Registration
    Live Scoring
      Football Goals/Cards
      Cricket Runs/Wickets
      Match Events Timeline
      MVP Tracking
    Player System
      Profiles & Stats
      Achievements
      Win Rate Tracking
      Performance Charts
    Rankings
      Weekly Leaderboards
      Monthly Leaderboards
      All-Time Rankings
      City Rankings
    AI Features
      Match Predictions
      Performance Coach
      Team Builder
      xG Analysis
    Turf Booking
      Search & Filter
      Slot Availability
      Online Payment
      Reviews & Ratings
    Community
      Social Feed
      Match Results
      Achievements
      Comments & Likes
```

### Draw.io Diagrams

Open these in [draw.io](https://app.diagrams.net) or the VS Code Draw.io extension:

- [`docs/architecture.drawio`](./docs/architecture.drawio) — Full system architecture (Vercel + AWS)
- [`docs/tournament-flow.drawio`](./docs/tournament-flow.drawio) — Tournament lifecycle sequence diagram

---

## 📁 Repository Structure

```
.
├── TurfArena/                        # 🎯 Main Next.js Application
│   ├── app/                          # App Router (pages + API)
│   │   ├── page.tsx                  # Splash / landing page
│   │   ├── layout.tsx                # Root layout with AuthProvider
│   │   ├── globals.css               # Tailwind + CSS variables
│   │   ├── auth/                     # Login page
│   │   ├── onboarding/               # 3-step onboarding wizard
│   │   ├── home/                     # Role-based redirect hub
│   │   ├── customer-dashboard/       # Player dashboard (credits, bookings, turfs)
│   │   ├── discover/                 # Tournament discovery + sport filters
│   │   ├── community/                # Social feed (posts, likes, comments)
│   │   ├── leaderboards/             # Rankings with podium (Players/Teams/Turfs)
│   │   ├── live/                     # Live match center (football + cricket)
│   │   ├── ai/                       # AI Coach chat + match predictions
│   │   ├── profile/                  # Player profile + achievements
│   │   ├── stats/                    # Statistics (charts, sport breakdown)
│   │   ├── team/                     # Team management + formation view
│   │   ├── tournaments/              # Tournament listing
│   │   │   └── [id]/                 # Tournament detail (tabs: Overview/Teams/Fixtures)
│   │   │       └── register/         # Team registration wizard (3 steps)
│   │   ├── turfs/                    # Turf listing + detail
│   │   │   └── [id]/                 # Turf detail + slot booking
│   │   ├── turfs-explore/            # Turf search with filters
│   │   ├── my-bookings/              # User's bookings
│   │   ├── notifications/            # Notification center
│   │   ├── settings/                 # User settings
│   │   ├── organizer/                # 🏆 Organizer Dashboard
│   │   │   ├── page.tsx              # KPIs, tournament list, activity feed
│   │   │   ├── analytics/            # Tournament analytics
│   │   │   ├── revenue/              # Revenue tracking
│   │   │   ├── settings/             # Organizer settings
│   │   │   ├── teams/                # Team management
│   │   │   └── tournaments/          # Tournament CRUD
│   │   ├── owner/                    # 🏟️ Turf Owner Dashboard
│   │   │   ├── page.tsx              # Revenue, occupancy, turfs overview
│   │   │   ├── bookings/             # Booking management
│   │   │   ├── expenses/             # Expense tracking
│   │   │   ├── revenue/              # Revenue analytics
│   │   │   ├── settings/             # Owner settings
│   │   │   └── turfs/                # Turf management
│   │   └── api/                      # ⚡ REST API Endpoints
│   │       ├── tournaments/          # GET, POST
│   │       │   └── [id]/             # GET, PATCH
│   │       │       └── register/     # POST (team registration)
│   │       ├── matches/              # GET, POST
│   │       │   └── [id]/score/       # PATCH (live score updates)
│   │       ├── players/              # GET
│   │       │   └── [id]/stats/       # GET (per-sport stats)
│   │       ├── teams/                # GET, POST
│   │       └── turfs/                # GET
│   │           └── [id]/             # GET
│   │               └── book/         # POST (slot booking)
│   ├── components/                   # 🧩 Shared UI Components
│   │   ├── app-shell.tsx             # Mobile app shell wrapper
│   │   ├── bottom-nav.tsx            # Bottom navigation (5 tabs)
│   │   ├── sidebar.tsx               # Role-based sidebar menu
│   │   ├── back-header.tsx           # Back navigation header
│   │   ├── protected-route.tsx       # Auth + role guard
│   │   ├── organizer-layout.tsx      # Organizer page layout
│   │   ├── owner-layout.tsx          # Owner page layout
│   │   ├── countdown.tsx             # Tournament countdown timer
│   │   ├── sport-icon.tsx            # Sport-specific icons
│   │   ├── cards/                    # Reusable card components
│   │   │   ├── stat-card.tsx
│   │   │   ├── tournament-card.tsx
│   │   │   └── turf-card.tsx
│   │   └── ui/                       # Base UI primitives
│   │       └── button.tsx
│   ├── lib/                          # 📚 Utilities
│   │   ├── data.ts                   # Mock data + type definitions
│   │   ├── auth-context.tsx          # Auth provider (4 roles)
│   │   └── utils.ts                  # cn() Tailwind helper
│   ├── public/                       # 🖼️ Static Assets
│   │   ├── images/                   # Tournament, turf, player images
│   │   ├── icon.svg                  # App icon
│   │   └── placeholder-logo.png      # Default logo
│   ├── docs/                         # 📄 Documentation
│   │   └── architecture.drawio       # AWS architecture diagram
│   ├── next.config.mjs               # Next.js configuration
│   ├── tsconfig.json                 # TypeScript config
│   ├── postcss.config.mjs            # PostCSS + Tailwind
│   ├── package.json                  # Dependencies + scripts
│   ├── package-lock.json             # Lockfile
│   ├── SETUP_GUIDE.md                # Team setup guide
│   └── PERFORMANCE_OPTIMIZATIONS.md  # Performance notes
│
├── lib/                              # ☁️ AWS Service Layer
│   └── aws/
│       ├── index.ts                  # Barrel exports
│       ├── config.ts                 # AWS_ENABLED flag + region
│       ├── dynamodb.ts               # DynamoDB client + CRUD helpers
│       ├── eventbridge.ts            # Event publisher + notifications
│       └── tables.ts                 # Table schemas + TypeScript types
│
├── scripts/                          # 🔧 Infrastructure Scripts
│   ├── setup-aws.ts                  # Creates 9 DynamoDB tables + EventBridge bus
│   └── seed-aws.ts                   # Seeds tables with demo data
│
├── .env.example                      # Environment variable template
├── .env.local                        # Local credentials (gitignored)
├── .gitignore                        # Git ignore rules
├── AWS_SETUP.md                      # Detailed AWS integration guide
├── package.json                      # Root scripts (aws:setup, aws:seed)
├── tsconfig.json                     # Path alias config (@/*)
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
git clone https://github.com/<your-username>/TurfArena.git
cd TurfArena/TurfArena
npm install
```

### Run Locally (no AWS needed)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app uses mock data when AWS is not configured.

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
# From the root directory:

# 1. Fill in .env.local with your AWS credentials
#    AWS_REGION=us-east-1
#    AWS_ACCESS_KEY_ID=your-key
#    AWS_SECRET_ACCESS_KEY=your-secret

# 2. Create DynamoDB tables + EventBridge bus + seed data
npm run aws:init

# 3. Start app (now connected to DynamoDB)
cd TurfArena && npm run dev
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

See [AWS_SETUP.md](./AWS_SETUP.md) for full details, IAM policies, and Vercel deployment.

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
| POST | `/api/turfs/:id/book` | Book a slot |

---

## Available Scripts

### Root Level (AWS infrastructure)

| Command | Description |
|---------|-------------|
| `npm run aws:setup` | Create DynamoDB tables + EventBridge bus |
| `npm run aws:seed` | Populate tables with demo data |
| `npm run aws:init` | Setup + seed in one command |

### Inside TurfArena/ (Next.js app)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

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

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com) — set root directory to `TurfArena/`
3. Add environment variables:
   - `AWS_REGION` = `us-east-1`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `EVENTBRIDGE_BUS_NAME` = `TurfArena-Events`
4. Deploy

---

## Cost Estimate

| Service | Cost |
|---------|------|
| DynamoDB (PAY_PER_REQUEST) | ~$0 (free tier: 25 RCU + 25 WCU) |
| EventBridge | ~$0 (14M events/month free) |
| Vercel (Hobby) | Free |
| **Total** | **Free for development/demos** |

---

## License

MIT — see [LICENSE](./TurfArena/LICENSE)
