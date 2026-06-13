# 🏟️ TurfArena – The Operating System for Local Sports Communities

> **Hackathon:** [H0: Hack the Zero Stack with Vercel v0 and AWS Databases](https://devpost.com)

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?logo=next.js)](https://nextjs.org)
[![Powered by Vercel v0](https://img.shields.io/badge/Powered%20by-Vercel%20v0-000?logo=vercel)](https://v0.dev)
[![Database: DynamoDB](https://img.shields.io/badge/Database-Amazon%20DynamoDB-4053D6?logo=amazondynamodb)](https://aws.amazon.com/dynamodb/)
[![Notifications: EventBridge](https://img.shields.io/badge/Events-Amazon%20EventBridge-FF9900?logo=amazonaws)](https://aws.amazon.com/eventbridge/)

---

## 📌 Problem

Across India, thousands of football, cricket, badminton, volleyball, and basketball turfs host matches every weekend. Most tournaments are managed through WhatsApp groups, spreadsheets, or manual processes. There is **no centralized platform** for player statistics, rankings, tournament history, online registration, digital score tracking, or turf management.

---

## 💡 Solution

**TurfArena** is a platform that connects players, team captains, tournament organizers, and turf owners in a single ecosystem. It enables:

- Tournament management with automatic bracket generation
- Live score tracking
- Player profiles & rankings
- Match analytics
- Business tools for turf owners

---

## 🎯 Target Users

| Role | Description |
|------|-------------|
| **Players** | Join tournaments, track performance, build sports profiles |
| **Team Captains** | Manage teams and lineups |
| **Tournament Organizers** | Create and run competitions |
| **Turf Owners** | Manage bookings and host events |

---

## 🚀 Core Features

```mermaid
mindmap
  root((TurfArena))
    Tournament Management
      Knockout Format
      League Format
      Group Stage
      Auto Bracket Generation
    Real-Time Scoring
      Live Updates
      Goals & Wickets
      Match Events
      MVP Tracking
    Player Profiles
      Match History
      Win Rates
      Achievements
      Performance Stats
    Rankings
      Global Rankings
      City Rankings
      Turf Rankings
    AI Features
      Match Insights
      Team Builder
      Tournament Predictor
      Performance Coach
    Turf Management
      Bookings
      Revenue Analytics
      Event Hosting
```

### Feature List

- **Tournament Management** – Knockout, league, and group-stage tournaments with automatic bracket generation
- **Real-Time Score Updates** – Live scoring, goals, wickets, match events, and MVP tracking
- **Player Profiles** – Matches played, win rates, achievements, and performance history
- **Global Rankings** – Rankings for players, teams, and turfs
- **Match Analytics** – Detailed statistics for football, cricket, and other sports

---

## 🤖 AI Features

- **AI Match Insights** – Post-match analysis and key moments
- **AI Team Builder** – Suggest optimal team compositions
- **AI Tournament Predictor** – Predict outcomes based on team stats
- **AI Performance Coach** – Personalized improvement tips for players

---

## 🏗️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | [Vercel](https://vercel.com) + [Next.js](https://nextjs.org) + [v0](https://v0.dev) |
| **Backend** | AWS Lambda + API Gateway |
| **Database** | Amazon DynamoDB |
| **Notifications** | Amazon EventBridge |

---

## 🏛️ Architecture Overview

> 📐 **Full architecture diagram available:** [`docs/architecture.drawio`](./docs/architecture.drawio) – Open in [draw.io](https://app.diagrams.net) or VS Code with the Draw.io extension.

```mermaid
graph TD
    subgraph Users
        A[Players]
        B[Team Captains]
        C[Tournament Organizers]
        D[Turf Owners]
    end

    subgraph Frontend ["▲ Vercel Platform (v0.app)"]
        E[Next.js 14 App Router]
        F[v0 AI UI Components]
        G[Vercel Edge Functions]
        VA[Vercel Analytics]
    end

    subgraph Backend ["☁️ AWS Backend"]
        H[Amazon API Gateway<br/>REST + WebSocket]
        I[AWS Lambda Functions]
    end

    subgraph Database ["💾 AWS Database"]
        J[(Amazon DynamoDB)]
    end

    subgraph Events ["📡 Events & Notifications"]
        K[Amazon EventBridge]
        L[Real-Time Notifications]
        M[Tournament Alerts]
    end

    subgraph Observability ["🔍 Observability"]
        N[CloudWatch Logs & Metrics]
        O[AWS X-Ray Tracing]
        P[Vercel Speed Insights]
        Q[CloudWatch Alarms + SNS]
    end

    A & B & C & D --> E & F
    E --> H
    G --> H
    H --> I
    I --> J
    I --> K
    K --> L & M
    L & M -.->|Push| A & B & C & D
    I -.-> N & O
    E -.-> VA & P
    N --> Q
```

---

## 🚀 Deployment

| Layer | Platform | URL Pattern | CI/CD |
|-------|----------|-------------|-------|
| **Frontend** | Vercel | `turfarena.v0.app` or `turfarena.vercel.app` | Auto-deploy on `git push` to `main` |
| **Backend** | AWS Lambda | Via API Gateway endpoint | GitHub Actions + AWS SAM/CDK |
| **Database** | Amazon DynamoDB | Serverless (no provisioning) | Infrastructure as Code |

### Vercel Deployment Flow

```mermaid
flowchart LR
    A[Developer] -->|git push| B[GitHub]
    B -->|Webhook| C[Vercel Build]
    C --> D{Branch?}
    D -->|main| E[Production Deploy<br/>turfarena.vercel.app]
    D -->|feature/*| F[Preview Deploy<br/>turfarena-xyz.vercel.app]
    E --> G[Vercel Edge Network<br/>Global CDN]
    F --> H[Preview URL<br/>Share with team]
```

### How to Deploy

```bash
# Frontend: Deploy to Vercel (automatic via Git)
git push origin main  # triggers production deploy

# Or manually via CLI
vercel --prod

# Backend: Deploy Lambda functions via SAM
cd infrastructure
sam build
sam deploy --guided
```

---

## 🔍 Observability & Monitoring

Full-stack observability covering frontend performance, backend execution, and database operations.

```mermaid
graph TB
    subgraph Frontend Monitoring
        VA[Vercel Analytics<br/>Core Web Vitals]
        VS[Vercel Speed Insights<br/>Page Load Performance]
        VL[Vercel Logs<br/>Edge Function Logs]
    end

    subgraph Backend Monitoring
        CW[CloudWatch Logs<br/>Lambda Execution Logs]
        XR[AWS X-Ray<br/>Distributed Tracing]
        CM[CloudWatch Metrics<br/>Latency, Errors, Throttles]
    end

    subgraph Database Monitoring
        DM[DynamoDB Metrics<br/>Read/Write Capacity]
        DC[DynamoDB Contributor Insights<br/>Hot Keys Detection]
    end

    subgraph Alerting
        CA[CloudWatch Alarms]
        SNS[Amazon SNS<br/>Email / SMS Alerts]
    end

    VA --> |Web Vitals Dashboard| DASH[Observability Dashboard]
    VS --> DASH
    CW --> DASH
    XR --> DASH
    CM --> CA
    DM --> CA
    CA --> SNS
```

### What We Monitor

| Layer | Tool | Metrics |
|-------|------|---------|
| **Frontend** | Vercel Analytics | LCP, FID, CLS, TTFB, INP |
| **Frontend** | Vercel Speed Insights | Page load time, route performance |
| **Backend** | CloudWatch Logs | Lambda invocations, errors, cold starts |
| **Backend** | AWS X-Ray | End-to-end request tracing, latency breakdown |
| **Database** | DynamoDB Metrics | Read/Write capacity, throttled requests |
| **Events** | EventBridge Metrics | Event delivery, failed invocations |
| **Alerts** | CloudWatch Alarms + SNS | Error rate spikes, latency thresholds, 5xx responses |

### Observability Setup

```bash
# Enable X-Ray tracing in Lambda (add to SAM template)
# Tracing: Active

# Install Vercel Analytics in Next.js
npm install @vercel/analytics @vercel/speed-insights
```

```typescript
// app/layout.tsx - Add Vercel observability
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 🔄 Tournament Flow

```mermaid
sequenceDiagram
    participant O as Organizer
    participant T as TurfArena
    participant DB as DynamoDB
    participant EB as EventBridge
    participant P as Players

    O->>T: Create Tournament
    T->>DB: Store Tournament Details
    DB-->>T: Confirmation

    T->>EB: Publish "Tournament Created" Event
    EB-->>P: Notification: New Tournament Available

    P->>T: Register Team
    T->>DB: Save Registration
    DB-->>T: Confirmation

    O->>T: Start Match
    T->>DB: Create Match Record
    DB-->>T: Match ID

    loop During Match
        O->>T: Update Score
        T->>DB: Save Live Score
        DB-->>T: Updated Rankings
        T->>EB: Publish "Score Updated" Event
        EB-->>P: Live Score Notification
    end

    O->>T: End Match
    T->>DB: Store Final Results
    T->>DB: Update Player Statistics
    T->>DB: Update Leaderboards
    T->>EB: Publish "Match Completed" Event
    EB-->>P: Match Result Notification
```

---

## 🧑‍💻 User Journey

```mermaid
flowchart LR
    subgraph Player Journey
        P1[Sign Up] --> P2[Create Profile]
        P2 --> P3[Join/Create Team]
        P3 --> P4[Register for Tournament]
        P4 --> P5[Play Matches]
        P5 --> P6[View Stats & Rankings]
        P6 --> P7[Get AI Insights]
    end

    subgraph Organizer Journey
        O1[Sign Up] --> O2[Create Tournament]
        O2 --> O3[Set Format & Rules]
        O3 --> O4[Open Registrations]
        O4 --> O5[Generate Brackets]
        O5 --> O6[Manage Live Scores]
        O6 --> O7[Publish Results]
    end

    subgraph Turf Owner Journey
        T1[Sign Up] --> T2[Register Turf]
        T2 --> T3[Set Availability]
        T3 --> T4[Receive Bookings]
        T4 --> T5[Host Tournaments]
        T5 --> T6[View Revenue Analytics]
    end
```

---

## 📊 DynamoDB Data Model

```mermaid
erDiagram
    PLAYERS {
        string playerId PK
        string name
        string city
        int ranking
        string email
        string phone
    }

    TEAMS {
        string teamId PK
        string teamName
        string captainId FK
        string sport
        string city
    }

    TOURNAMENTS {
        string tournamentId PK
        string name
        string sport
        string format
        string turfId FK
        string status
        date startDate
    }

    MATCHES {
        string matchId PK
        string tournamentId FK
        string teamA FK
        string teamB FK
        string status
        int scoreA
        int scoreB
        string mvpPlayerId FK
    }

    PLAYER_STATS {
        string playerId PK
        int matchesPlayed
        int wins
        int losses
        int mvpAwards
        float winRate
    }

    TURFS {
        string turfId PK
        string location
        string ownerId FK
        string city
        string sports
        float rating
    }

    BOOKINGS {
        string bookingId PK
        string turfId FK
        string tournamentId FK
        date date
        string timeSlot
        string status
    }

    LEADERBOARDS {
        string leaderboardId PK
        string type
        string city
        string sport
        string rankings
    }

    PLAYERS ||--o{ TEAMS : "captains"
    PLAYERS ||--|| PLAYER_STATS : "has"
    PLAYERS }o--o{ TEAMS : "belongs to"
    TOURNAMENTS ||--o{ MATCHES : "contains"
    TOURNAMENTS }o--|| TURFS : "hosted at"
    MATCHES }o--|| TEAMS : "teamA"
    MATCHES }o--|| TEAMS : "teamB"
    MATCHES }o--o| PLAYERS : "MVP"
    TURFS ||--o{ BOOKINGS : "has"
    TOURNAMENTS ||--o{ BOOKINGS : "reserves"
```

### Table Summary

| Table | Primary Key | Attributes |
|-------|------------|------------|
| **PLAYERS** | `playerId` (string) | name, city, ranking |
| **TEAMS** | `teamId` (string) | teamName, captainId |
| **TOURNAMENTS** | `tournamentId` (string) | name, sport |
| **MATCHES** | `matchId` (string) | tournamentId, status, score |
| **PLAYER_STATS** | `playerId` (string) | matchesPlayed, wins, mvpAwards |
| **TURFS** | `turfId` (string) | location, ownerId |

---

## 💰 Monetization

- Premium Player Profiles with advanced analytics and AI-generated performance reports
- Subscription plans for turf owners
- Pay-per-tournament tools for organizers

---

## 🛠️ Getting Started

See the full [Setup Guide](./SETUP_GUIDE.md) for detailed instructions.

### Quick Start

```bash
# Clone the repository
git clone https://github.com/<your-username>/TurfArena.git
cd TurfArena

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your AWS and Vercel credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Team & Collaboration

We use GitHub for collaboration. See the [Setup Guide](./SETUP_GUIDE.md) for step-by-step instructions on:

- Setting up the GitHub repository
- Inviting collaborators
- Branch workflow and contribution guidelines

---

## 📁 Project Structure

```
TurfArena/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components (v0 generated)
│   ├── lib/               # Utility functions and AWS clients
│   ├── api/               # API route handlers
│   └── types/             # TypeScript type definitions
├── infrastructure/        # AWS CDK / SAM templates
├── docs/                  # Documentation and diagrams
├── .env.example           # Environment variable template
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

---

## 🏆 Hackathon Submission

**H0: Hack the Zero Stack with Vercel v0 and AWS Databases**

TurfArena is a million-scale sports ecosystem that digitizes local sports communities. Players, teams, organizers, and turf owners can manage tournaments, track performance, view live leaderboards, and build verified sports profiles. Built with **Vercel v0**, **AWS Lambda**, and **Amazon DynamoDB**, it is designed to scale from a single neighborhood tournament to millions of sports enthusiasts worldwide.

---

## 📄 License

MIT License – see [LICENSE](./LICENSE) for details.

---

## 🙌 Acknowledgments

- [Vercel v0](https://v0.dev) for AI-powered UI generation
- [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) for serverless database
- [Amazon EventBridge](https://aws.amazon.com/eventbridge/) for real-time event handling
- [Next.js](https://nextjs.org) for the React framework
