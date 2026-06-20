# TurfArena — Troubleshooting Guide

## Live URL

**Production:** https://turf-arena-gilt.vercel.app

---

## Issues Encountered & Solutions

### 1. Vercel 404 NOT_FOUND on every page

**Error:**
```
404: NOT_FOUND
Middleware: 404 Not Found
```

**Root Cause:** Vercel's Root Directory was set to `TurfArena/` but all project files were moved to the repo root.

**Fix:**
- Moved all files from `TurfArena/` subfolder to repo root
- Set Vercel Root Directory to empty (`.`)
- Added `vercel.json` with explicit build command
- Redeployed via `vercel --prod`

---

### 2. Vercel DynamoDB Integration Conflict

**Error:** API routes returning mock data instead of real DynamoDB data in production.

**Root Cause:** Vercel's built-in DynamoDB integration (`aws-dynamodb-coquelicot-globe`) was overriding manually set environment variables with empty values.

**What happened:**
```
AWS_REGION=""           ← empty (should be us-east-1)
AWS_ACCESS_KEY_ID=""    ← empty
AWS_SECRET_ACCESS_KEY="" ← empty
```

**Fix:**
1. Removed old env vars: `vercel env rm AWS_REGION production --yes`
2. Re-added with actual values: `echo us-east-1 | vercel env add AWS_REGION production`
3. Recommendation: Remove the `aws-dynamodb-coquelicot-globe` integration from Vercel dashboard (Settings → Integrations → Disconnect)

---

### 3. Import Path Errors (`@/TurfArena/lib/...`)

**Error:**
```
Module not found: Can't resolve '@/TurfArena/lib/auth-context'
Module not found: Can't resolve '@/TurfArena/lib/data'
```

**Root Cause:** When files were copied between directories, some imports retained the old path prefix.

**Fix:** Found and replaced all occurrences:
```
@/TurfArena/lib/auth-context  →  @/lib/auth-context
@/TurfArena/lib/data          →  @/lib/data
@/TurfArena/lib/utils         →  @/lib/utils
```

Files affected: 20+ pages and components.

---

### 4. Missing `tsconfig.json`

**Error:**
```
Module not found: Can't resolve '@/lib/aws'
Module not found: Can't resolve '@/lib/data'
```

**Root Cause:** `tsconfig.json` was missing from the root, so the `@/` path alias wasn't configured.

**Fix:** Created `tsconfig.json` with path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### 5. Turbopack Build Failure (Space in Path)

**Error:**
```
Error: Next.js inferred your workspace root, but it may not be correct.
We couldn't find the Next.js package from: D:\github work\Turfarena\app
```

**Root Cause:** Next.js 16 Turbopack has issues with spaces in directory paths (`github work`).

**Fix:** Use webpack for builds instead of Turbopack:
```json
{
  "scripts": {
    "build": "next build --webpack"
  }
}
```

---

### 6. `package.json` Overwritten During `npm install`

**Error:** After running `npm install @aws-sdk/...`, the entire `package.json` was replaced with only the new dependencies.

**Root Cause:** Running `npm install` in a directory that didn't have a proper `package.json` created a new minimal one.

**Fix:** Rewrote `package.json` with all original + new dependencies and reinstalled.

---

### 7. Organizer Settings Page Truncated/Corrupt

**Error:**
```
Syntax Error: Unexpected eof at line 21
```

**Root Cause:** `app/organizer/settings/page.tsx` was partially written (file truncated).

**Fix:** Rewrote the complete settings page with notifications, security, and privacy toggle sections.

---

### 8. Production Domain Pointing to Wrong Deployment

**Error:** `turf-arena-gilt.vercel.app` showing 404 even after successful CLI deploy.

**Root Cause:** The domain alias was still pointing to an old broken GitHub-triggered deployment.

**Fix:**
```bash
vercel alias turf-arena-jdkod1mmb-turfarena-projects.vercel.app turf-arena-gilt.vercel.app
```

---

### 9. `node_modules` Mixed Between Directories

**Error:**
```
Module not found: Can't resolve './icons/calendar.mjs' (lucide-react)
```

**Root Cause:** `node_modules` from a different directory was copied over, causing corrupted module references.

**Fix:**
```bash
rmdir /s /q node_modules
rmdir /s /q .next
npm install
```

---

### 10. AWS Region Change (ap-south-1 → us-east-1)

**Files updated:**
- `lib/aws/config.ts`
- `lib/aws/dynamodb.ts`
- `lib/aws/eventbridge.ts`
- `scripts/setup-aws.ts`
- `scripts/seed-aws.ts`
- `.env.example`
- `AWS_SETUP.md`
- `SETUP_GUIDE.md`
- `docs/architecture.drawio`
- `README.md`

---

## Environment Variables (Vercel)

| Variable | Value | Environments |
|----------|-------|--------------|
| `AWS_REGION` | `us-east-1` | Production, Development |
| `AWS_ACCESS_KEY_ID` | `AKIAWZLAF4ABD...` | Production, Development |
| `AWS_SECRET_ACCESS_KEY` | (encrypted) | Production, Development |
| `EVENTBRIDGE_BUS_NAME` | `TurfArena-Events` | Production, Development |

---

## AWS Resources (Account: 466742534146, us-east-1)

### DynamoDB Tables (9)

| Table | Items | Status |
|-------|-------|--------|
| TurfArena_Players | 8 | Active |
| TurfArena_Teams | 4 | Active |
| TurfArena_Tournaments | 4 | Active |
| TurfArena_Turfs | 4 | Active |
| TurfArena_PlayerStats | 8 | Active |
| TurfArena_Matches | 3 | Active |
| TurfArena_Bookings | 0 | Active |
| TurfArena_Registrations | 0 | Active |
| TurfArena_Leaderboards | 9 | Active |

### EventBridge

| Resource | ARN |
|----------|-----|
| Event Bus | `arn:aws:events:us-east-1:466742534146:event-bus/TurfArena-Events` |

---

## Useful Commands

```bash
# Deploy to production
vercel --prod

# Check env vars
vercel env ls

# View deployment logs
vercel logs <deployment-url>

# Reassign domain to a deployment
vercel alias <deployment-url> turf-arena-gilt.vercel.app

# Create DynamoDB tables
npm run aws:setup

# Seed demo data
npm run aws:seed

# Both setup + seed
npm run aws:init

# Local build (webpack)
npm run build

# Verify AWS tables
aws dynamodb list-tables --region us-east-1
aws dynamodb scan --table-name TurfArena_Players --region us-east-1 --select COUNT
```

---

## Prevention Checklist

- [ ] Root Directory in Vercel Settings = empty (not `TurfArena`)
- [ ] All env vars set for Production AND Development
- [ ] Remove `aws-dynamodb-coquelicot-globe` integration if not needed
- [ ] Always use `--webpack` flag for builds (avoids Turbopack path issues)
- [ ] Never run `npm install <package>` without existing `package.json` in same directory
- [ ] After moving files, grep for old import paths before committing
