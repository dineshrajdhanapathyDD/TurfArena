# TurfArena — AWS Integration Guide

This guide walks you through connecting TurfArena to AWS services (DynamoDB + EventBridge).

## Architecture

```
Vercel (Next.js)  →  API Routes (serverless)  →  Amazon DynamoDB
                                               →  Amazon EventBridge (notifications)
```

## Prerequisites

- **Node.js** 18+ installed
- **AWS Account** with programmatic access
- **AWS CLI** configured (optional, credentials can go in `.env.local`)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure AWS credentials

Edit `.env.local` and fill in your credentials:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your-secret-key
EVENTBRIDGE_BUS_NAME=TurfArena-Events
```

> **Tip:** If you have AWS CLI configured with a profile, you can skip the access key/secret and just set `AWS_REGION`.

### 3. Create DynamoDB tables + EventBridge bus

```bash
npm run aws:setup
```

This creates 9 DynamoDB tables (PAY_PER_REQUEST billing — you only pay for what you use):

| Table | Primary Key | GSIs |
|-------|-------------|------|
| TurfArena_Players | playerId | CityIndex |
| TurfArena_Teams | teamId | CaptainIndex |
| TurfArena_Tournaments | tournamentId | SportStatusIndex |
| TurfArena_Turfs | turfId | OwnerIndex |
| TurfArena_PlayerStats | playerId + sport | — |
| TurfArena_Matches | matchId | TournamentIndex |
| TurfArena_Bookings | bookingId | TurfIndex, UserIndex |
| TurfArena_Registrations | registrationId | TournamentIndex |
| TurfArena_Leaderboards | partitionKey + playerId | — |

### 4. Seed initial data

```bash
npm run aws:seed
```

Seeds players, teams, tournaments, turfs, matches, stats, and leaderboard entries.

### 5. Run the app

```bash
npm run dev
```

The app now reads/writes from DynamoDB. API routes at `/api/*` are fully functional.

## One-Command Setup

```bash
npm run aws:init
```

Runs both `aws:setup` and `aws:seed` in sequence.

## How It Works

### Dual Mode (AWS + Mock)

The app uses a centralized flag in `lib/aws/config.ts`:

```ts
export const AWS_ENABLED = !!process.env.AWS_REGION
```

- **AWS_REGION set** → all API routes query DynamoDB
- **AWS_REGION empty** → routes return mock data from `lib/data.ts`

This means you can develop locally without AWS. Just remove or empty `AWS_REGION` in `.env.local`.

### EventBridge Notifications

Events are published to the `TurfArena-Events` bus for:

| Event | Trigger |
|-------|---------|
| `tournament.created` | New tournament created |
| `team.registered` | Team registers for tournament |
| `match.started` | Match begins |
| `score.updated` | Live score change |
| `match.completed` | Match finishes |
| `booking.confirmed` | Turf slot booked |
| `player.achievement` | Player unlocks achievement |

You can add EventBridge Rules in the AWS Console to route these to Lambda, SNS, SQS, etc. for push notifications.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tournaments | List tournaments (filter: sport, city, status) |
| POST | /api/tournaments | Create tournament |
| GET | /api/tournaments/:id | Get tournament details |
| PATCH | /api/tournaments/:id | Update tournament |
| POST | /api/tournaments/:id/register | Register team |
| GET | /api/matches | List matches (filter: status, tournamentId) |
| POST | /api/matches | Create match |
| PATCH | /api/matches/:id/score | Update live score |
| GET | /api/players | List players (filter: city) |
| GET | /api/players/:id/stats | Player stats per sport |
| GET | /api/teams | List teams (filter: captainId, sport) |
| POST | /api/teams | Create team |
| GET | /api/turfs | List turfs (filter: sport, area, maxPrice, ownerId) |
| GET | /api/turfs/:id | Get turf details |
| POST | /api/turfs/:id/book | Book a slot |

## IAM Permissions Required

Your AWS credentials need these permissions:

```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:Query",
    "dynamodb:Scan",
    "dynamodb:UpdateItem",
    "dynamodb:DeleteItem",
    "dynamodb:CreateTable",
    "dynamodb:DescribeTable",
    "events:PutEvents",
    "events:CreateEventBus",
    "events:DescribeEventBus"
  ],
  "Resource": [
    "arn:aws:dynamodb:us-east-1:*:table/TurfArena_*",
    "arn:aws:events:us-east-1:*:event-bus/TurfArena-Events"
  ]
}
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `AWS_REGION`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `EVENTBRIDGE_BUS_NAME`
4. Deploy — Vercel runs your API routes as serverless functions (equivalent to Lambda)

## Cost Estimate

With PAY_PER_REQUEST billing and typical hackathon/demo usage:

- **DynamoDB**: ~$0 (free tier covers 25 RCU + 25 WCU)
- **EventBridge**: ~$0 (first 14M events/month free)
- **Total**: Effectively free for development and demos
