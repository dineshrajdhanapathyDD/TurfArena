# 🛠️ TurfArena – Setup Guide

This guide walks you through setting up the project locally, creating the GitHub repository, and collaborating with your team.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create the GitHub Repository](#create-the-github-repository)
3. [Invite Your Collaborator](#invite-your-collaborator)
4. [Clone & Set Up Locally](#clone--set-up-locally)
5. [Environment Variables](#environment-variables)
6. [AWS Setup](#aws-setup)
7. [Vercel Deployment](#vercel-deployment)
8. [Branch Workflow](#branch-workflow)
9. [Running the Project](#running-the-project)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)
- [GitHub CLI (gh)](https://cli.github.com/) (optional but recommended)
- [AWS CLI](https://aws.amazon.com/cli/) (configured with credentials)
- [Vercel CLI](https://vercel.com/cli) (optional for deployment)
- A [GitHub account](https://github.com)
- An [AWS account](https://aws.amazon.com) (Free Tier works)
- A [Vercel account](https://vercel.com)

---

## Create the GitHub Repository

### Option A: Using GitHub CLI (Recommended)

```bash
# Navigate to your project folder
cd d:\DD - work\Devpost\TurfArena

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial TurfArena project setup"

# Create the GitHub repo and push
gh repo create TurfArena --public --description "The Operating System for Local Sports Communities - H0 Hackathon" --source . --push
```

### Option B: Using GitHub Website

1. Go to [https://github.com/new](https://github.com/new)
2. Fill in the details:
   - **Repository name:** `TurfArena`
   - **Description:** `The Operating System for Local Sports Communities - H0 Hackathon`
   - **Visibility:** Public
   - Do NOT initialize with README (we already have one)
3. Click **Create repository**
4. Then push your local code:

```bash
cd "d:\DD - work\Devpost\TurfArena"
git init
git add .
git commit -m "feat: initial TurfArena project setup"
git branch -M main
git remote add origin https://github.com/<your-username>/TurfArena.git
git push -u origin main
```

---

## Invite Your Collaborator

### Option A: Using GitHub CLI

```bash
gh repo invite <collaborator-username> --repo <your-username>/TurfArena
```

### Option B: Using GitHub Website

1. Go to your repository: `https://github.com/<your-username>/TurfArena`
2. Click **Settings** → **Collaborators** (left sidebar)
3. Click **Add people**
4. Enter your colleague's GitHub username or email
5. Select the appropriate role:
   - **Write** – Can push code, create branches, merge PRs
   - **Admin** – Full access including settings
6. Click **Add**
7. Your colleague will receive an email invitation – they must accept it

### For Your Collaborator (After Accepting Invite)

```bash
# Clone the repository
git clone https://github.com/<your-username>/TurfArena.git
cd TurfArena

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Fill in the credentials (get them from the team lead)
```

---

## Clone & Set Up Locally

```bash
# Clone the repo
git clone https://github.com/<your-username>/TurfArena.git
cd TurfArena

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

---

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# AWS Configuration
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# DynamoDB Table Names
DYNAMODB_PLAYERS_TABLE=TurfArena-Players
DYNAMODB_TEAMS_TABLE=TurfArena-Teams
DYNAMODB_TOURNAMENTS_TABLE=TurfArena-Tournaments
DYNAMODB_MATCHES_TABLE=TurfArena-Matches
DYNAMODB_PLAYER_STATS_TABLE=TurfArena-PlayerStats
DYNAMODB_TURFS_TABLE=TurfArena-Turfs

# EventBridge
EVENTBRIDGE_BUS_NAME=TurfArena-Events

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication (if using NextAuth or similar)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local` to Git.** It's already in `.gitignore`.

---

## AWS Setup

### 1. Create DynamoDB Tables

You can create tables using the AWS Console or CLI:

```bash
# Players Table
aws dynamodb create-table \
  --table-name TurfArena-Players \
  --attribute-definitions AttributeName=playerId,AttributeType=S \
  --key-schema AttributeName=playerId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Teams Table
aws dynamodb create-table \
  --table-name TurfArena-Teams \
  --attribute-definitions AttributeName=teamId,AttributeType=S \
  --key-schema AttributeName=teamId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Tournaments Table
aws dynamodb create-table \
  --table-name TurfArena-Tournaments \
  --attribute-definitions AttributeName=tournamentId,AttributeType=S \
  --key-schema AttributeName=tournamentId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Matches Table
aws dynamodb create-table \
  --table-name TurfArena-Matches \
  --attribute-definitions AttributeName=matchId,AttributeType=S \
  --key-schema AttributeName=matchId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Player Stats Table
aws dynamodb create-table \
  --table-name TurfArena-PlayerStats \
  --attribute-definitions AttributeName=playerId,AttributeType=S \
  --key-schema AttributeName=playerId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Turfs Table
aws dynamodb create-table \
  --table-name TurfArena-Turfs \
  --attribute-definitions AttributeName=turfId,AttributeType=S \
  --key-schema AttributeName=turfId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1
```

### 2. Create EventBridge Event Bus

```bash
aws events create-event-bus \
  --name TurfArena-Events \
  --region ap-south-1
```

### 3. IAM Permissions

Make sure your AWS user/role has permissions for:
- `dynamodb:*` on your TurfArena tables
- `events:PutEvents` on your EventBridge bus
- `lambda:InvokeFunction` if using Lambda

---

## Vercel Deployment

### 1. Connect to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# For production deployment
vercel --prod
```

### 2. Add Environment Variables on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your TurfArena project
3. Go to **Settings** → **Environment Variables**
4. Add all the variables from `.env.local`
5. Make sure to set them for **Production**, **Preview**, and **Development**

---

## Branch Workflow

We follow the **GitHub Flow** branching strategy:

```
main (production-ready code)
├── feature/tournament-management
├── feature/player-profiles
├── feature/live-scoring
├── fix/auth-bug
└── chore/setup-dynamodb
```

### Creating a Feature Branch

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Create a new branch
git checkout -b feature/your-feature-name

# Work on your changes...
git add .
git commit -m "feat: add tournament creation page"

# Push your branch
git push -u origin feature/your-feature-name
```

### Creating a Pull Request

```bash
# Using GitHub CLI
gh pr create --title "feat: add tournament creation page" --body "Description of changes"

# Or go to GitHub and create PR from the web UI
```

### Code Review & Merge

1. Your collaborator reviews the PR
2. Address any feedback
3. Once approved, merge via GitHub (Squash and Merge recommended)
4. Delete the feature branch after merging

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` – New feature
- `fix:` – Bug fix
- `docs:` – Documentation changes
- `style:` – Code style (formatting, etc.)
- `refactor:` – Code refactoring
- `test:` – Adding or updating tests
- `chore:` – Maintenance tasks

---

## Running the Project

### Development Server

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `npm install` fails | Delete `node_modules` and `package-lock.json`, then run `npm install` again |
| AWS credentials error | Run `aws configure` and verify your keys |
| DynamoDB table not found | Check your region matches `.env.local` settings |
| Git push rejected | Pull latest changes first: `git pull origin main --rebase` |
| Vercel deploy fails | Check build logs on Vercel dashboard for specific errors |

### Getting Help

- Check the [GitHub Issues](https://github.com/<your-username>/TurfArena/issues)
- Ask in the team chat
- Review [Next.js docs](https://nextjs.org/docs)
- Review [AWS DynamoDB docs](https://docs.aws.amazon.com/dynamodb/)

---

## 📋 Quick Reference Commands

```bash
# Start dev server
npm run dev

# Create new branch
git checkout -b feature/name

# Push branch
git push -u origin feature/name

# Create PR
gh pr create

# Pull latest main
git checkout main && git pull

# Deploy to Vercel
vercel --prod
```

---

Happy building! 🏟️⚽🏏🏸
