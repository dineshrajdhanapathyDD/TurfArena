/**
 * TurfArena AWS Infrastructure Setup
 * Creates DynamoDB tables and EventBridge event bus.
 *
 * Usage:
 *   npx tsx scripts/setup-aws.ts
 *
 * Requires AWS credentials configured via environment variables or AWS CLI profile.
 */

import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  type CreateTableCommandInput,
} from '@aws-sdk/client-dynamodb'
import {
  EventBridgeClient,
  CreateEventBusCommand,
  DescribeEventBusCommand,
} from '@aws-sdk/client-eventbridge'

const REGION = process.env.AWS_REGION || 'us-east-1'

const dynamodb = new DynamoDBClient({ region: REGION })
const eventbridge = new EventBridgeClient({ region: REGION })

// ─── Table Definitions ──────────────────────────────────────────

const tables: CreateTableCommandInput[] = [
  {
    TableName: 'TurfArena_Players',
    KeySchema: [{ AttributeName: 'playerId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'playerId', AttributeType: 'S' },
      { AttributeName: 'city', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CityIndex',
        KeySchema: [{ AttributeName: 'city', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'TurfArena_Teams',
    KeySchema: [{ AttributeName: 'teamId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'teamId', AttributeType: 'S' },
      { AttributeName: 'captainId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CaptainIndex',
        KeySchema: [{ AttributeName: 'captainId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'TurfArena_Tournaments',
    KeySchema: [{ AttributeName: 'tournamentId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'tournamentId', AttributeType: 'S' },
      { AttributeName: 'sport', AttributeType: 'S' },
      { AttributeName: 'status', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'SportStatusIndex',
        KeySchema: [
          { AttributeName: 'sport', KeyType: 'HASH' },
          { AttributeName: 'status', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'TurfArena_Turfs',
    KeySchema: [{ AttributeName: 'turfId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'turfId', AttributeType: 'S' },
      { AttributeName: 'ownerId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'OwnerIndex',
        KeySchema: [{ AttributeName: 'ownerId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'TurfArena_PlayerStats',
    KeySchema: [
      { AttributeName: 'playerId', KeyType: 'HASH' },
      { AttributeName: 'sport', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'playerId', AttributeType: 'S' },
      { AttributeName: 'sport', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'TurfArena_Matches',
    KeySchema: [{ AttributeName: 'matchId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'matchId', AttributeType: 'S' },
      { AttributeName: 'tournamentId', AttributeType: 'S' },
      { AttributeName: 'status', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'TournamentIndex',
        KeySchema: [
          { AttributeName: 'tournamentId', KeyType: 'HASH' },
          { AttributeName: 'status', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'TurfArena_Bookings',
    KeySchema: [{ AttributeName: 'bookingId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'bookingId', AttributeType: 'S' },
      { AttributeName: 'turfId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'TurfIndex',
        KeySchema: [{ AttributeName: 'turfId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
      {
        IndexName: 'UserIndex',
        KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'TurfArena_Registrations',
    KeySchema: [{ AttributeName: 'registrationId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'registrationId', AttributeType: 'S' },
      { AttributeName: 'tournamentId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'TournamentIndex',
        KeySchema: [{ AttributeName: 'tournamentId', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'TurfArena_Leaderboards',
    KeySchema: [
      { AttributeName: 'partitionKey', KeyType: 'HASH' },
      { AttributeName: 'playerId', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'partitionKey', AttributeType: 'S' },
      { AttributeName: 'playerId', AttributeType: 'S' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
]

// ─── Helper Functions ───────────────────────────────────────────

async function tableExists(tableName: string): Promise<boolean> {
  try {
    await dynamodb.send(new DescribeTableCommand({ TableName: tableName }))
    return true
  } catch (err: any) {
    if (err.name === 'ResourceNotFoundException') return false
    throw err
  }
}

async function createTable(params: CreateTableCommandInput) {
  const name = params.TableName!
  if (await tableExists(name)) {
    console.log(`  ✓ Table "${name}" already exists — skipping`)
    return
  }
  await dynamodb.send(new CreateTableCommand(params))
  console.log(`  ✓ Created table "${name}"`)
}

async function createEventBus(busName: string) {
  try {
    await eventbridge.send(new DescribeEventBusCommand({ Name: busName }))
    console.log(`  ✓ Event bus "${busName}" already exists — skipping`)
  } catch (err: any) {
    if (err.name === 'ResourceNotFoundException') {
      await eventbridge.send(new CreateEventBusCommand({ Name: busName }))
      console.log(`  ✓ Created event bus "${busName}"`)
    } else {
      throw err
    }
  }
}

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  console.log(`\n🏟️  TurfArena AWS Setup`)
  console.log(`   Region: ${REGION}\n`)

  console.log('📦 Creating DynamoDB tables...')
  for (const table of tables) {
    await createTable(table)
  }

  console.log('\n📡 Creating EventBridge event bus...')
  await createEventBus('TurfArena-Events')

  console.log('\n✅ AWS infrastructure setup complete!')
  console.log('   Next step: run `npx tsx scripts/seed-aws.ts` to populate data\n')
}

main().catch((err) => {
  console.error('\n❌ Setup failed:', err.message)
  process.exit(1)
})
