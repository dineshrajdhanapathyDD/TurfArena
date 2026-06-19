/**
 * AWS Configuration
 *
 * When AWS_REGION is set, the app connects to real DynamoDB and EventBridge.
 * When unset (local dev without AWS), routes fall back to mock data from lib/data.ts.
 *
 * To enable AWS integration:
 * 1. Copy .env.example to .env.local
 * 2. Fill in your AWS credentials
 * 3. Run `npx tsx scripts/setup-aws.ts` to create tables
 * 4. Run `npx tsx scripts/seed-aws.ts` to populate data
 */

export const AWS_ENABLED = !!process.env.AWS_REGION

export const AWS_CONFIG = {
  region: process.env.AWS_REGION || 'us-east-1',
  eventBusName: process.env.EVENTBRIDGE_BUS_NAME || 'TurfArena-Events',
}
