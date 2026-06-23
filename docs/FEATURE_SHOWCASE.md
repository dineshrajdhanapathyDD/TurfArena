# TurfArena — Feature Showcase

> A complete walkthrough of every feature in TurfArena with screenshot references.

**Live Demo:** [turf-arena-gilt.vercel.app](https://turf-arena-gilt.vercel.app)

---

## Table of Contents

1. [Authentication & Onboarding](#1-authentication--onboarding)
2. [Player Dashboard](#2-player-dashboard)
3. [Tournament System](#3-tournament-system)
4. [Live Match Scoring](#4-live-match-scoring)
5. [Turf Booking (Valkey-Powered)](#5-turf-booking-valkey-powered)
6. [AI Coach (Amazon Bedrock)](#6-ai-coach-amazon-bedrock)
7. [Maps & Location](#7-maps--location)
8. [Community Feed](#8-community-feed)
9. [Leaderboards & Rankings](#9-leaderboards--rankings)
10. [Organizer Dashboard](#10-organizer-dashboard)
11. [Turf Owner Dashboard](#11-turf-owner-dashboard)
12. [Mobile Responsive Design](#12-mobile-responsive-design)
13. [AWS Infrastructure](#13-aws-infrastructure)

---

## 1. Authentication & Onboarding

TurfArena supports 4 user roles, each with its own dashboard and capabilities.

### Login Page
- Role-based login with visual indicators
- Dark theme with glassmorphism card design
- Animated background with sports imagery

![Auth Page](./screenshots/auth-page.png)

### Test Credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Player | customer@turf.com | customer123 | `/customer-dashboard` |
| Captain | captain@turf.com | captain123 | `/customer-dashboard` |
| Organizer | organizer@turf.com | organizer123 | `/organizer` |
| Turf Owner | owner@turf.com | owner123 | `/owner` |

### Onboarding Wizard
- 3-step flow: Profile → Sports → Preferences
- Collects player information for AI personalization
- Smooth animations with Framer Motion

![Onboarding](./screenshots/onboarding.png)

---

## 2. Player Dashboard

The main hub for players after login — shows everything at a glance.

### Features
- Upcoming matches with countdown timers
- Quick stats (matches played, win rate, ranking)
- AI-powered performance insights card
- Recent activity timeline
- Quick links to book turfs, join tournaments

![Player Dashboard](./screenshots/player-dashboard.png)

### Player Profile
- Full performance history across all sports
- Achievement badges (MVP, Hat-trick, Clean Sheet)
- Season-by-season stats breakdown
- AI-generated improvement suggestions

![Player Profile](./screenshots/player-profile.png)

### Player Statistics
- Visual charts for performance trends
- Sport-specific metrics (goals, assists for football; runs, wickets for cricket)
- Comparison with average players in same city

![Player Stats](./screenshots/player-stats.png)

---

## 3. Tournament System

Complete tournament lifecycle management — from creation to results.

### Tournament Discovery
- Filter by sport, city, status (upcoming/active/completed)
- Entry fee and prize pool display
- Team slots remaining indicator
- Registration deadline countdown

![Tournament List](./screenshots/tournament-list.png)

### Tournament Detail Page
- Tabbed view: Overview | Teams | Brackets | Matches | Results
- Real-time team count from DynamoDB
- Registration button with capacity check
- Organizer contact information

![Tournament Detail](./screenshots/tournament-detail.png)

### Tournament Registration (3-Step Wizard)
1. **Team Info** — Select existing team or create new
2. **Player Selection** — Choose roster from team members
3. **Payment Review** — Confirm entry fee and register

**DynamoDB Operations:**
- `PutItem` → Registrations table
- `UpdateItem` → Tournaments table (atomic `teamsJoined++`)
- EventBridge → `team.registered` event

![Tournament Registration](./screenshots/tournament-registration.png)

### Tournament Formats Supported
- **Knockout** — Single elimination bracket
- **League** — Round-robin with points table
- **Group Stage** — Groups → knockout rounds

---

## 4. Live Match Scoring

Real-time score updates with sport-specific UIs.

### Football Live Score
- Minute-by-minute event timeline
- Goal scorers, cards (yellow/red), substitutions
- Half-time stats display
- Animated score counter

![Live Football](./screenshots/live-match-football.png)

### Cricket Live Score
- Ball-by-ball commentary
- Runs, wickets, overs tracker
- Batting/bowling scorecard
- Run rate and required rate calculator

![Live Cricket](./screenshots/live-match-cricket.png)

### How Live Scoring Works
```
Organizer → PATCH /api/matches/:id/score
         → DynamoDB UpdateItem (score + list_append events[])
         → EventBridge PutEvents (score.updated)
         → Client polling (5s interval) picks up new score
```

**DynamoDB Feature:** `list_append` adds new events to the existing array without overwriting — supporting unlimited match events.

---

## 5. Turf Booking (Valkey-Powered)

Real-time slot booking with double-booking prevention.

### Turf Discovery
- Search by sport, area, price range
- Distance sorting (when location enabled)
- Rating and review display
- Amenity icons (parking, changing room, floodlights)

![Turf List](./screenshots/turf-list.png)

### Turf Detail + Booking
- Interactive map showing turf location (Leaflet + OpenStreetMap)
- Photo gallery with turf images
- Date picker (HTML5 native, current year)
- Time slot grid with real-time availability
- Price per hour display

![Turf Booking](./screenshots/turf-booking.png)

### Booking Flow (Technical)
```
1. User selects date + time slot
2. API checks Valkey: EXISTS slot:turfId:date:time
3. If available → SET slot:turfId:date:time NX EX 300 (5-min lock)
4. Lock acquired → PutItem to DynamoDB Bookings table
5. Success → SET slot:turfId:date:time EX 86400 (mark booked 24h)
6. EventBridge → booking.confirmed event
7. User sees confirmation with booking ID
```

**Race Condition Prevention:** If two users book the same slot within milliseconds, only one gets the `NX` lock — the other receives `423 Locked`.

![Booking Confirmation](./screenshots/booking-confirmation.png)

### My Bookings
- Upcoming, past, and cancelled bookings
- Cancel with reason (updates DynamoDB status)
- Booking ID for reference

![My Bookings](./screenshots/my-bookings.png)

---

## 6. AI Coach (Amazon Bedrock)

Powered by **Amazon Nova Micro** (`us.amazon.nova-micro-v1:0`) — generates personalized insights from real player statistics stored in DynamoDB.

### AI Coach Chat Page (`/ai`)
- Chat-like interface for AI interactions
- Multiple insight types via tabs/buttons
- Real-time response from Bedrock API

![AI Coach](./screenshots/ai-coach.png)

### AI Insight Types

| Type | Input (from DynamoDB) | Output |
|------|----------------------|--------|
| **Performance Coach** | PlayerStats (wins, losses, goals, MVP) | Strengths, weaknesses, weekly goal, tips |
| **Match Prediction** | Both teams' stats | Win probability (0-1), confidence, key factors |
| **Team Builder** | Available players' stats | Optimal formation, chemistry score, suggestions |
| **Commentary** | Live match events | Narrative text describing key moments |
| **Strategy** | Opponent team stats | Tactical recommendations, formation counter |

### AI Insight Cards (Embedded)
These appear across multiple pages:
- **Profile page** — Performance summary card
- **Tournament page** — Win prediction for upcoming match
- **Live match page** — Real-time tactical suggestions

![AI Insight Card](./screenshots/ai-insight-card.png)

### How AI Works (Technical)
```
1. User requests AI insight (e.g. "coach me")
2. API route: POST /api/ai/coach
3. Query DynamoDB PlayerStats (by playerId, all sports)
4. Build prompt with real stats context
5. InvokeModel → Amazon Bedrock Nova Micro
6. Parse response → structured JSON
7. Return to frontend → render insight card
```

---

## 7. Maps & Location

Free mapping with OpenStreetMap + Leaflet (no API key required).

### Map View on Turf Detail
- Interactive map with zoom/pan
- Turf location marker with popup
- Distance from user's current location
- Directions link (opens Google Maps)

![Map View](./screenshots/map-view.png)

### Location-Based Features
- **Nearby Turfs** — Haversine distance calculation within radius
- **GPS Check-in** — Verify player is within 200m of venue
- **Live Tracking** — Store player positions during match (for future heatmaps)

### Geofencing (200m Check-in)
```
POST /api/location/checkin
Body: { userId, matchId, lat, lng }

1. Get venue coordinates from Turfs table
2. Calculate Haversine distance:
   d = 2R × arcsin(√(sin²(Δlat/2) + cos(lat1)cos(lat2)sin²(Δlng/2)))
3. If d ≤ 200m → "Checked in at Greenfield Arena (45m from venue)"
4. If d > 200m → "Too far from venue (523m). Move closer to check in."
```

---

## 8. Community Feed

Social features for the sports community.

### Feed Features
- Post types: Match Result, Achievement, Highlight, Discussion
- Like and comment on posts
- User avatars and timestamps
- Sport-specific tags and icons

![Community Feed](./screenshots/community-feed.png)

### Post Types
| Type | Content | Example |
|------|---------|---------|
| Match Result | Score + key stats | "Phoenix FC 3-1 Thunder. Arjun scored a hat-trick" |
| Achievement | Badge unlock | "MVP of the Month unlocked!" |
| Highlight | Big moment | "Last-minute equalizer at Greenfield Arena" |
| Discussion | Community topic | "Looking for a 5v5 football game this Saturday" |

---

## 9. Leaderboards & Rankings

Competitive rankings across players, teams, and turfs.

### Podium View
- Top 3 with gold/silver/bronze visual
- Animated rank display
- Win rate, points, matches played

![Leaderboards](./screenshots/leaderboards.png)

### Leaderboard Categories
- **Weekly** — Reset every Monday
- **Monthly** — Calendar month rankings
- **All-Time** — Lifetime performance
- **City** — Local rankings (e.g., Bengaluru top players)

### Ranking Calculation
```
Points = (Wins × 3) + (Draws × 1) + (MVP × 5) + (Goals × 0.5)
Rank = sorted by points DESC, then win rate DESC
```

---

## 10. Organizer Dashboard

Full tournament management interface for organizers.

### Dashboard Overview
- Active tournaments count
- Total teams registered
- Revenue from entry fees
- Recent registrations from DynamoDB

![Organizer Dashboard](./screenshots/organizer-dashboard.png)

### Organizer Features
| Page | Purpose |
|------|---------|
| `/organizer` | Dashboard with KPIs |
| `/organizer/tournaments` | Create, edit, delete tournaments |
| `/organizer/teams` | View registered teams |
| `/organizer/analytics` | Performance charts |
| `/organizer/revenue` | Entry fee income |
| `/organizer/settings` | Notification preferences |

### DynamoDB Integration
- Real tournaments fetched via `GET /api/tournaments`
- Green "DB" badge on items from DynamoDB (vs mock data)
- Both real and mock data shown together for demo

![Organizer Tournaments](./screenshots/organizer-tournaments.png)

---

## 11. Turf Owner Dashboard

Business management tools for turf owners.

### Dashboard Overview
- Today's bookings count
- Monthly revenue (calculated from booking amounts)
- Occupancy rate percentage
- Recent bookings with customer details

![Owner Dashboard](./screenshots/owner-dashboard.png)

### Owner Features
| Page | Purpose |
|------|---------|
| `/owner` | Dashboard with booking KPIs |
| `/owner/turfs` | Manage turf listings |
| `/owner/bookings` | All bookings (real + mock) |
| `/owner/revenue` | Income tracking |
| `/owner/expenses` | Cost management |
| `/owner/settings` | Turf settings |

### Real Booking Display
- Bookings from DynamoDB shown with green "DB" badge
- Historical mock bookings shown alongside for demo
- Customer name, date, slot, sport, amount, status
- Booking ID for reference

![Owner Bookings](./screenshots/owner-bookings.png)

---

## 12. Mobile Responsive Design

Every page works perfectly from 320px mobile to desktop.

### Mobile Navigation
- Bottom navigation bar with 5 key items (Home, Discover, AI Coach, Bookings, Profile)
- Hamburger menu for additional pages
- Touch-optimized button sizes (min 44px)

![Mobile Nav](./screenshots/mobile-nav.png)

### Responsive Layouts
- Cards stack vertically on mobile
- Tables become scrollable card lists
- Sidebar collapses to bottom nav
- Forms adapt to screen width

![Mobile Responsive](./screenshots/mobile-responsive.png)

### Dark Theme
- Custom CSS variables for consistent theming
- Glassmorphism card effects (backdrop-blur)
- Careful contrast ratios for readability
- No white backgrounds with dark text issues

![Dark Theme](./screenshots/dark-theme.png)

---

## 13. AWS Infrastructure

Production infrastructure running on AWS (us-east-1).

### DynamoDB Tables (9)
All tables use PAY_PER_REQUEST billing (zero idle cost).

![DynamoDB Tables](./screenshots/dynamodb-tables.png)

### EventBridge Bus
- Bus name: `TurfArena-Events`
- 7 event types fire on key actions
- Ready for SNS/SQS/Lambda consumers

![EventBridge](./screenshots/eventbridge-events.png)

### Amazon Bedrock
- Model: Nova Micro (`us.amazon.nova-micro-v1:0`)
- Region: us-east-1
- Used for 5 AI functions

![Bedrock](./screenshots/bedrock-console.png)

### Valkey (Upstash Redis)
- Serverless Redis-compatible
- TLS encrypted connection
- Used for slot locking and caching

![Valkey](./screenshots/valkey-upstash.png)

### Vercel Deployment
- Serverless functions (22 API routes)
- Edge CDN for static assets
- Analytics for Core Web Vitals
- Environment variables for AWS credentials

![Vercel Deployment](./screenshots/vercel-deployment.png)

---

## Screenshot Capture Guide

To populate the `docs/screenshots/` folder, follow these steps:

### Desktop Screenshots (1280x720)
1. Open [turf-arena-gilt.vercel.app](https://turf-arena-gilt.vercel.app)
2. Set browser window to 1280x720
3. Navigate to each page and capture

### Mobile Screenshots (375x812)
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12/13 Pro (375x812)
4. Capture mobile layouts

### AWS Console Screenshots
1. Login to AWS Console (us-east-1)
2. DynamoDB → Tables → capture table list
3. EventBridge → Event buses → capture TurfArena-Events
4. Bedrock → Model access → capture Nova Micro

### Recommended Naming Convention
```
docs/screenshots/
├── auth-page.png
├── onboarding.png
├── player-dashboard.png
├── player-profile.png
├── player-stats.png
├── tournament-list.png
├── tournament-detail.png
├── tournament-registration.png
├── live-match-football.png
├── live-match-cricket.png
├── turf-list.png
├── turf-booking.png
├── booking-confirmation.png
├── my-bookings.png
├── ai-coach.png
├── ai-insight-card.png
├── map-view.png
├── community-feed.png
├── leaderboards.png
├── organizer-dashboard.png
├── organizer-tournaments.png
├── owner-dashboard.png
├── owner-bookings.png
├── mobile-nav.png
├── mobile-responsive.png
├── dark-theme.png
├── dynamodb-tables.png
├── eventbridge-events.png
├── bedrock-console.png
├── valkey-upstash.png
└── vercel-deployment.png
```

---

## Feature Comparison Matrix

| Feature | Status | AWS Service | DynamoDB Table |
|---------|--------|-------------|----------------|
| User Authentication | Done | — (local) | Players |
| Tournament CRUD | Done | DynamoDB + EventBridge | Tournaments |
| Team Registration | Done | DynamoDB | Registrations |
| Live Scoring | Done | DynamoDB + EventBridge | Matches |
| Turf Booking | Done | DynamoDB + Valkey | Bookings + Turfs |
| AI Coach | Done | Bedrock (Nova Micro) | PlayerStats |
| Map View | Done | — (OpenStreetMap) | Turfs (coordinates) |
| Community Feed | Done | — (mock) | — |
| Leaderboards | Done | DynamoDB | Leaderboards |
| GPS Check-in | Done | DynamoDB | Bookings |
| Nearby Turfs | Done | DynamoDB (scan + Haversine) | Turfs |
| Booking Cancellation | Done | DynamoDB | Bookings |
| Tournament Deletion | Done | DynamoDB | Tournaments |
| Player Stats | Done | DynamoDB (composite key) | PlayerStats |
| Rate Limiting | Done | Valkey (INCR + EXPIRE) | — |
| Push Notifications | Planned | EventBridge → SNS | — |
| Payment Integration | Planned | — (Razorpay) | — |
| Real-time WebSocket | Planned | API Gateway WebSocket | — |
| Image Uploads | Planned | S3 + CloudFront | — |
| MFA Authentication | Planned | Amazon Cognito | — |

---

*Built for the **H0: Hack the Zero Stack with Vercel v0 and AWS Databases** hackathon.*
