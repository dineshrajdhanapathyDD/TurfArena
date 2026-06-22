# TurfArena — About the Project

## Inspiration

Every weekend across India, thousands of football, cricket, badminton, volleyball, and basketball turfs host matches. But here's the problem — most tournaments are managed through **WhatsApp groups and spreadsheets**. There's no centralized platform for player statistics, rankings, tournament history, online registration, digital score tracking, or turf management.

We witnessed this firsthand. Local players had no way to track their performance across seasons. Organizers struggled with manual bracket generation and payment collection. Turf owners had no visibility into booking patterns or revenue analytics.

We asked: **What if local sports communities had their own operating system?**

That's how TurfArena was born — a platform that connects players, team captains, tournament organizers, and turf owners in a single ecosystem.

---

## What it does

TurfArena is a full-stack sports platform with **21 API endpoints**, **44 pages**, and **9 DynamoDB tables** that enables:

**For Players:**
- Join tournaments, track performance across football, cricket, basketball
- View live scores with ball-by-ball (cricket) and minute-by-minute (football) updates
- AI-powered performance coach with win predictions and improvement tips
- Community feed to share match results, achievements, highlights
- GPS-based check-in at match venues (200m geofencing)

**For Team Captains:**
- Manage team rosters and formations
- Register teams for tournaments with multi-step wizard
- Track team statistics and rankings

**For Tournament Organizers:**
- Create knockout, league, and group-stage tournaments
- Live score management with EventBridge real-time notifications
- Revenue tracking and analytics dashboard

**For Turf Owners:**
- Manage turf bookings with slot availability
- Track revenue, occupancy rates, and expenses
- Receive booking confirmations via EventBridge events

**AI Features:**
- **Performance Analysis** — strengths, weaknesses, weekly goals based on $n$ matches
- **Match Prediction** — win probability calculated as:

$$P(\text{win}) = \min\left(\frac{W}{M} + 0.02 \times S + F, \ 0.95\right)$$

where $W$ = wins, $M$ = matches played, $S$ = current streak, $F$ = form factor

- **AI Coach** — personalized drills and estimated improvement percentages
- **Team Builder** — suggested formations and teammate chemistry scoring

---

## How we built it

### Architecture

```
Browser → Vercel (Next.js 16 SSR + API Routes) → Amazon DynamoDB (us-east-1)
                                                → Amazon EventBridge (notifications)
```

### Frontend
- **Next.js 16** with App Router for SSR and static generation
- **React 19** with Framer Motion for smooth animations
- **Tailwind CSS 4** with custom dark theme (glassmorphism design)
- **44 pages** including 4 role-specific dashboards

### Backend
- **21 serverless API routes** deployed on Vercel (functionally equivalent to AWS Lambda + API Gateway)
- **AWS SDK v3** for DynamoDB and EventBridge integration
- **Dual-mode architecture** — `AWS_ENABLED` flag for graceful degradation (falls back to mock data when AWS is unavailable)

### Database (DynamoDB)
- **9 tables** with PAY_PER_REQUEST billing
- **7 Global Secondary Indexes** for efficient query patterns
- **Composite keys** (PlayerStats: playerId + sport)
- **Atomic counters** (teamsJoined++ without race conditions)
- **List append** (match events added in real-time)

### Events
- **Amazon EventBridge** with 7 event types (tournament.created, score.updated, booking.confirmed, etc.)
- Event-driven architecture ready for push notifications via SNS/SQS

### Infrastructure as Code
- `scripts/setup-aws.ts` — creates all 9 tables + EventBridge bus
- `scripts/seed-aws.ts` — populates demo data (8 players, 4 teams, 4 tournaments, 4 turfs, 3 matches, 9 leaderboard entries)

---

## Challenges we ran into

### 1. Turbopack + Space in Directory Path
Next.js 16 Turbopack failed with our directory path (`D:\github work\Turfarena`). The space in "github work" caused workspace root detection to break. **Solution:** Used `--webpack` flag for builds.

### 2. Vercel Root Directory Conflicts
The project was initially in a `TurfArena/` subfolder. Vercel's GitHub deploy kept looking at the wrong root, causing 404s. **Solution:** Flattened the structure, moved everything to repo root, and used CLI deploys with `--force`.

### 3. Import Path Corruption
When moving files between directories, 20+ files retained `@/TurfArena/lib/` import paths instead of `@/lib/`. This caused webpack "Module not found" errors. **Solution:** Systematic grep + replace across all `.tsx` files.

### 4. DynamoDB Integration Conflict with Vercel
Vercel's built-in DynamoDB integration (`aws-dynamodb-coquelicot-globe`) was overriding our manually set environment variables with empty strings. **Solution:** Removed the integration, re-set env vars via CLI.

### 5. Text Contrast on White Backgrounds
Some pages used `bg-white` with `text-gray-*` classes that became invisible when the global dark theme was applied. **Solution:** Audited all 44 pages, replaced every `text-gray-*` with theme-aware `text-foreground` / `text-muted-foreground`.

### 6. Real-Time Score Updates Without WebSocket
DynamoDB doesn't natively support real-time push. **Solution:** Used EventBridge as an event bus + client-side polling with `setInterval`. Planned upgrade: API Gateway WebSocket.

---

## Accomplishments that we're proud of

- **21 working API endpoints** with full CRUD operations connected to live DynamoDB tables
- **AI Insights Engine** that generates personalized performance analysis, win predictions, coaching tips, and team building suggestions — all calculated from real player stats in DynamoDB
- **Live location geofencing** — players can check in at venues only if GPS confirms they're within 200 meters (Haversine formula)
- **Multi-sport live scoring** — supports both football (goals, cards, minute-by-minute) and cricket (runs, wickets, overs, ball-by-ball) with animated UI
- **Event-driven architecture** — 7 EventBridge event types fire automatically on key actions, ready for push notifications
- **Zero-cost infrastructure** — entire platform runs within AWS Free Tier ($0/month for development)
- **44 pages** with consistent dark theme, responsive design, and glassmorphism UI
- **4 distinct user roles** with role-specific dashboards, navigation, and permissions
- **Tournament registration wizard** — 3-step flow (team info → player selection → payment review)
- **Community social feed** — posts, likes, comments with type-based categorization

---

## What we learned

- **DynamoDB access patterns must be designed upfront.** Unlike SQL, you can't just add JOINs later. We learned to think about GSIs and composite keys from day one.
- **Serverless doesn't mean simple.** Managing environment variables across Vercel environments (Production, Preview, Development) taught us about deployment pipelines.
- **EventBridge is powerful for decoupling.** By publishing events on key actions, we can add new consumers (email, push, analytics) without changing existing code.
- **Mobile-first dark themes need careful contrast auditing.** What looks great on one background becomes invisible on another.
- **AWS SDK v3 is modular and tree-shakeable** — unlike v2, we only bundle the DynamoDB and EventBridge clients we actually use.
- **Feature flags (`AWS_ENABLED`) save development time.** Being able to toggle between real DynamoDB and mock data means frontend and backend teams can work independently.

---

## What's next for TurfArena

| Timeline | Feature | Technology |
|----------|---------|-----------|
| **Phase 1** (Next 2 weeks) | Real-time live scores via WebSocket | API Gateway WebSocket |
| **Phase 1** | Push notifications | EventBridge → SNS → Mobile |
| **Phase 2** (1 month) | Payment integration | Razorpay / Stripe |
| **Phase 2** | Image uploads (team logos, turf photos) | S3 + CloudFront CDN |
| **Phase 2** | Real authentication | Amazon Cognito (OIDC) |
| **Phase 3** (3 months) | Multi-city expansion | DynamoDB Global Tables |
| **Phase 3** | Advanced AI (ML-based predictions) | Amazon SageMaker |
| **Phase 3** | Video highlights | S3 + MediaConvert |
| **Phase 4** (6 months) | Native mobile apps | React Native |
| **Phase 4** | Referee assignment system | New DynamoDB table + matching algorithm |
| **Phase 4** | Sponsorship marketplace | Connect brands with tournament organizers |

### Revenue Roadmap

$$\text{MRR} = (P \times \$5) + (O \times \$15) + (T \times \$2 \times N)$$

Where:
- $P$ = Premium player subscriptions
- $O$ = Turf owner monthly plans
- $T$ = Tournament entry fee commission rate
- $N$ = Average tournaments per month

**Target:** 1000 turfs × ₹500/month = **₹5L MRR** within 12 months in Bengaluru alone.

---

*Built for the H0: Hack the Zero Stack with Vercel v0 and AWS Databases hackathon.*
