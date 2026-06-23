# TurfArena — About the Project

> The Operating System for Local Sports Communities

**Live Demo:** [turf-arena-gilt.vercel.app](https://turf-arena-gilt.vercel.app)  
**GitHub:** [github.com/dineshrajdhanapathyDD/TurfArena](https://github.com/dineshrajdhanapathyDD/TurfArena)

---

## Inspiration

Every weekend across India, thousands of football, cricket, badminton, volleyball, and basketball turfs host matches. But here's the reality — most tournaments are managed through **WhatsApp groups and spreadsheets**. There's no centralized platform for player statistics, rankings, tournament history, online registration, digital score tracking, or turf management.

We witnessed this firsthand:
- Local players had **no way to track performance** across seasons
- Organizers struggled with **manual bracket generation** and payment collection
- Turf owners had **zero visibility** into booking patterns or revenue analytics
- Team captains maintained rosters via **screenshots and group chats**

We asked: **What if local sports communities had their own operating system?**

That's how TurfArena was born — a platform that connects players, team captains, tournament organizers, and turf owners in a single ecosystem powered by AWS.

---

## What it does

TurfArena is a full-stack sports platform with **22 API endpoints**, **44 pages**, and **9 DynamoDB tables** that enables:

### For Players
- Join tournaments, track performance across football, cricket, basketball
- View live scores with ball-by-ball (cricket) and minute-by-minute (football) updates
- AI-powered performance coach with win predictions and improvement tips
- Community feed to share match results, achievements, highlights
- GPS-based check-in at match venues (200m geofencing)

![Player Dashboard](./screenshots/player-dashboard.png)
*Player dashboard showing upcoming matches, performance stats, and AI recommendations*

### For Team Captains
- Manage team rosters and formations
- Register teams for tournaments with multi-step wizard
- Track team statistics and rankings

![Team Management](./screenshots/team-management.png)
*Team formation view with player positions and match history*

### For Tournament Organizers
- Create knockout, league, and group-stage tournaments
- Live score management with EventBridge real-time notifications
- Revenue tracking and analytics dashboard
- Delete/edit tournaments with safety checks (can't delete active ones)

![Organizer Dashboard](./screenshots/organizer-dashboard.png)
*Organizer dashboard with tournament analytics, revenue metrics, and team registrations from DynamoDB*

### For Turf Owners
- Manage turf bookings with real-time slot availability (Valkey-powered)
- Track revenue, occupancy rates, and expenses
- Receive booking confirmations via EventBridge events
- View both live DynamoDB bookings and historical data

![Owner Dashboard](./screenshots/owner-dashboard.png)
*Owner dashboard showing real bookings (green DB badge) alongside historical data*

### AI Features (Amazon Bedrock - Nova Micro)
- **Performance Analysis** — strengths, weaknesses, weekly goals based on match history
- **Match Prediction** — win probability calculated from real player stats:

$$P(\text{win}) = \min\left(\frac{W}{M} + 0.02 \times S + F, \ 0.95\right)$$

where $W$ = wins, $M$ = matches played, $S$ = current streak, $F$ = form factor

- **AI Coach** — personalized drills and estimated improvement percentages
- **Team Builder** — suggested formations and teammate chemistry scoring

![AI Coach](./screenshots/ai-coach.png)
*AI Coach providing personalized training recommendations and match predictions*

### Real-Time Booking (Valkey/Redis)
- Atomic slot locking prevents double-booking (`SET key NX EX 300`)
- Instant availability checks with 60s cache TTL
- Rate limiting per user to prevent abuse

![Turf Booking](./screenshots/turf-booking.png)
*Turf booking flow with calendar date picker, time slot selection, and real-time availability*

### Maps & Location
- OpenStreetMap + Leaflet integration (free, no API key)
- Nearby turfs search with Haversine distance calculation
- GPS-based check-in with 200m geofencing

![Map View](./screenshots/map-view.png)
*Interactive map showing turf location with distance indicator*

---

## How we built it

### Architecture Overview

```
Browser (PWA) → Vercel Edge CDN → Next.js 16 (SSR + API Routes)
                                         ├─→ Amazon DynamoDB (9 tables, us-east-1)
                                         ├─→ Amazon EventBridge (7 event types)
                                         ├─→ Upstash Valkey/Redis (slot locking)
                                         ├─→ Amazon Bedrock Nova Micro (AI coach)
                                         └─→ OpenStreetMap (maps)
```

![Architecture Diagram](./screenshots/architecture-diagram.png)
*Full system architecture — open `docs/architecture.drawio` in draw.io for editable version*

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 16 | App Router, SSR, Static Generation |
| React 19 | UI with concurrent features |
| Tailwind CSS 4 | Custom dark theme, glassmorphism |
| Framer Motion | Smooth page transitions and animations |
| Leaflet | Interactive maps (OpenStreetMap tiles) |
| Lucide React | Consistent iconography |

- **44 pages** including 4 role-specific dashboards
- Mobile-first responsive design (320px to desktop)
- Dark theme with careful contrast auditing (WCAG-aware)

![Mobile View](./screenshots/mobile-responsive.png)
*Mobile responsive layout with bottom navigation and touch-optimized targets*

### Backend (Serverless API)
| Technology | Purpose |
|-----------|---------|
| Vercel Serverless Functions | 22 API routes (equivalent to Lambda + API Gateway) |
| AWS SDK v3 | DynamoDB + EventBridge client (tree-shakeable) |
| Upstash Redis | Valkey-compatible slot locking |
| Amazon Bedrock | AI insights generation |

- **Dual-mode architecture** — `AWS_ENABLED` flag for graceful degradation
- Falls back to mock data when AWS is unavailable (zero downtime)
- Structured error logging: `[DynamoDB] [Valkey] [API] [Bedrock]`

### Database (Amazon DynamoDB)
| Feature | Implementation |
|---------|---------------|
| 9 tables | PAY_PER_REQUEST billing (zero idle cost) |
| 7 GSIs | Efficient query patterns without table scans |
| Composite keys | PlayerStats: `playerId` + `sport` for per-sport stats |
| Atomic counters | `teamsJoined++` without race conditions |
| List append | Match events added in real-time without overwriting |
| Conditional writes | Tournament capacity checks before registration |

![DynamoDB Tables](./screenshots/dynamodb-tables.png)
*AWS Console showing all 9 TurfArena tables with active status*

### Events (Amazon EventBridge)
- **7 event types** fire automatically on key actions
- Event bus: `TurfArena-Events` (us-east-1)
- Ready for consumer expansion (SNS push, SQS email, Lambda analytics)

| Event | Trigger |
|-------|---------|
| `tournament.created` | New tournament published |
| `team.registered` | Team joins tournament |
| `match.started` | Match kicks off |
| `score.updated` | Live score change |
| `match.completed` | Final whistle |
| `booking.confirmed` | Turf slot booked |
| `player.achievement` | Achievement unlocked |

### AI (Amazon Bedrock)
- **Model:** Amazon Nova Micro (`us.amazon.nova-micro-v1:0`)
- Generates insights from real DynamoDB player stats
- 5 AI functions: coach, commentary, report, prediction, strategy

![Bedrock AI](./screenshots/bedrock-ai-insights.png)
*AI-generated performance insights based on real player statistics from DynamoDB*

### Cache (Upstash Valkey/Redis)
- Serverless Redis-compatible (us-east-1)
- Slot locking: `SET slot:turfId:date:time NX EX 300`
- Availability cache: 60s TTL per turf+date
- Rate limiting: `INCR` + `EXPIRE` per user

### Infrastructure as Code
```bash
npm run aws:setup   # Creates 9 DynamoDB tables + EventBridge bus
npm run aws:seed    # Populates demo data (8 players, 4 teams, 4 tournaments, etc.)
npm run aws:init    # Both in one command
```

---

## Challenges we ran into

### 1. Turbopack + Space in Directory Path
Next.js 16 Turbopack failed with our directory path (`D:\github work\Turfarena`). The space in "github work" caused workspace root detection to break.  
**Solution:** Used `--webpack` flag for builds.

### 2. Vercel Root Directory Conflicts
The project was initially in a `TurfArena/` subfolder. Vercel's GitHub deploy kept looking at the wrong root, causing 404s on every page.  
**Solution:** Flattened the structure, moved everything to repo root, used CLI deploys with `vercel --prod`.

### 3. DynamoDB Integration Conflict
Vercel's built-in DynamoDB integration (`aws-dynamodb-coquelicot-globe`) was overriding our manually set environment variables with empty strings — causing silent fallback to mock data.  
**Solution:** Removed the integration, re-set env vars via Vercel CLI.

### 4. Import Path Corruption
When restructuring the project, 20+ files retained `@/TurfArena/lib/` import paths instead of `@/lib/`. This caused webpack "Module not found" errors that only appeared at build time.  
**Solution:** Systematic grep + replace across all `.tsx` files.

### 5. Dark Theme Contrast Issues
Some pages used `bg-white` with `text-gray-*` classes that became invisible when the global dark theme was applied. Text literally disappeared.  
**Solution:** Audited all 44 pages, replaced every hardcoded color with theme-aware CSS variables (`text-foreground`, `text-muted-foreground`, `bg-surface-2`).

### 6. Real-Time Without WebSocket
DynamoDB doesn't natively support real-time push. Live scores needed instant updates.  
**Solution:** EventBridge as event bus + client-side polling with `setInterval(5000)`. Planned upgrade: API Gateway WebSocket.

### 7. Double-Booking Race Conditions
Two users booking the same slot at the same millisecond would both succeed with DynamoDB alone.  
**Solution:** Added Valkey (Redis) with `SET NX` atomic locking — only one user can hold a slot lock at a time.

---

## Accomplishments that we're proud of

- **22 working API endpoints** with full CRUD operations connected to live DynamoDB tables in production
- **AI Insights Engine** powered by Amazon Bedrock Nova Micro — generates personalized performance analysis, win predictions, coaching tips, and team building suggestions from real player stats
- **Real-time slot locking** with Valkey (Redis) — prevents double-booking with atomic `SET NX EX` operations
- **Live location geofencing** — players can check in at venues only if GPS confirms they're within 200 meters (Haversine formula)
- **Multi-sport live scoring** — supports both football (goals, cards, minute-by-minute) and cricket (runs, wickets, overs, ball-by-ball) with animated UI
- **Event-driven architecture** — 7 EventBridge event types fire automatically, ready for push notifications via SNS/SQS
- **Zero-cost infrastructure** — entire platform runs within AWS Free Tier ($0/month)
- **44 pages** with consistent dark theme, responsive design, and glassmorphism UI
- **4 distinct user roles** with role-specific dashboards, navigation, and permissions
- **Graceful degradation** — `AWS_ENABLED` feature flag means app never crashes, just falls back to mock data
- **Production deployment** at [turf-arena-gilt.vercel.app](https://turf-arena-gilt.vercel.app) with Vercel Edge CDN

---

## What we learned

1. **DynamoDB access patterns must be designed upfront.** Unlike SQL, you can't just add JOINs later. We learned to think about GSIs and composite keys from day one.

2. **Serverless doesn't mean simple.** Managing environment variables across Vercel environments (Production, Preview, Development) taught us about deployment pipelines and the importance of infrastructure-as-code.

3. **EventBridge is powerful for decoupling.** By publishing events on key actions, we can add new consumers (email, push, analytics) without changing existing code — true event-driven architecture.

4. **Mobile-first dark themes need careful contrast auditing.** What looks great on one background becomes invisible on another. We audited every page manually.

5. **AWS SDK v3 is modular and tree-shakeable** — unlike v2, we only bundle the DynamoDB, EventBridge, and Bedrock clients we actually use, keeping bundle size small.

6. **Feature flags save development time.** `AWS_ENABLED` and `VALKEY_ENABLED` let frontend and backend teams work independently — mock data for UI development, real data for integration testing.

7. **Redis/Valkey is essential for booking systems.** DynamoDB alone can't prevent race conditions in high-concurrency scenarios. The `SET NX` pattern is simple but powerful.

8. **Amazon Bedrock Nova Micro is fast and cost-effective** for generating insights from structured data. No fine-tuning needed — just good prompt engineering with player stats context.

---

## What's next for TurfArena

| Timeline | Feature | Technology |
|----------|---------|-----------|
| **Phase 1** (2 weeks) | Real-time live scores via WebSocket | API Gateway WebSocket |
| **Phase 1** | Push notifications | EventBridge → SNS → Mobile |
| **Phase 2** (1 month) | Payment integration | Razorpay / Stripe |
| **Phase 2** | Image uploads (team logos, turf photos) | S3 + CloudFront CDN |
| **Phase 2** | Real authentication with MFA | Amazon Cognito (OIDC) |
| **Phase 3** (3 months) | Multi-city expansion | DynamoDB Global Tables |
| **Phase 3** | Advanced AI (ML-based predictions) | Amazon SageMaker |
| **Phase 3** | Video highlights | S3 + MediaConvert |
| **Phase 4** (6 months) | Native mobile apps | React Native |
| **Phase 4** | Referee assignment system | Matching algorithm |
| **Phase 4** | Sponsorship marketplace | Connect brands with organizers |

### Revenue Roadmap

$$\text{MRR} = (P \times \$5) + (O \times \$15) + (T \times \$2 \times N)$$

Where:
- $P$ = Premium player subscriptions (advanced analytics + AI reports)
- $O$ = Turf owner monthly plans (booking management + revenue dashboard)
- $T$ = Tournament entry fee commission rate
- $N$ = Average tournaments per month

**Target:** 1000 turfs x ₹500/month = **₹5L MRR** within 12 months in Bengaluru alone.

---

## Built With

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Leaflet |
| **Backend** | Vercel Serverless Functions, AWS SDK v3 |
| **Database** | Amazon DynamoDB (9 tables, 7 GSIs, PAY_PER_REQUEST) |
| **Cache** | Upstash Redis / AWS ElastiCache Valkey |
| **Events** | Amazon EventBridge |
| **AI** | Amazon Bedrock (Nova Micro - `us.amazon.nova-micro-v1:0`) |
| **Maps** | OpenStreetMap + Leaflet.js |
| **Deployment** | Vercel (Edge CDN + Serverless) |
| **Monitoring** | Vercel Analytics, CloudWatch Metrics |
| **UI** | shadcn/ui, Lucide React |
| **Region** | AWS us-east-1 |

---

## Screenshots Reference

> Add screenshots to `docs/screenshots/` folder. Recommended captures:

| Screenshot | What to Capture |
|-----------|----------------|
| `player-dashboard.png` | Customer dashboard with stats cards and upcoming matches |
| `team-management.png` | Team page with formation and player list |
| `organizer-dashboard.png` | Organizer dashboard with tournaments from DynamoDB |
| `owner-dashboard.png` | Owner dashboard with bookings (green DB badge for real data) |
| `ai-coach.png` | AI Coach chat page with recommendations |
| `turf-booking.png` | Turf detail page with date picker and slot selection |
| `map-view.png` | Map view on turf detail page showing location |
| `mobile-responsive.png` | Mobile view showing bottom nav and responsive layout |
| `live-match.png` | Live match scoring with football/cricket toggle |
| `tournament-detail.png` | Tournament detail page with brackets/teams |
| `community-feed.png` | Community page with posts, likes, comments |
| `leaderboards.png` | Leaderboards page with podium view |
| `auth-page.png` | Login page with role selection |
| `dynamodb-tables.png` | AWS Console showing DynamoDB tables |
| `architecture-diagram.png` | Export of draw.io architecture diagram |
| `bedrock-ai-insights.png` | AI insights cards on profile/tournament pages |
| `valkey-booking-flow.png` | Booking confirmation with slot lock success |
| `eventbridge-events.png` | AWS Console showing EventBridge bus and rules |

### How to Take Screenshots

1. Open the live site: [turf-arena-gilt.vercel.app](https://turf-arena-gilt.vercel.app)
2. Login with different roles (see test credentials in README)
3. Use browser DevTools (F12) → Toggle device toolbar for mobile views
4. Capture and save to `docs/screenshots/` folder
5. Recommended: 1280x720 for desktop, 375x812 for mobile

---

*Built for the **H0: Hack the Zero Stack with Vercel v0 and AWS Databases** hackathon.*
