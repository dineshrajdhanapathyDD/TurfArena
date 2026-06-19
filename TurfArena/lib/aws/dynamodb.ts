import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  type GetCommandInput,
  type PutCommandInput,
  type QueryCommandInput,
  type ScanCommandInput,
  type UpdateCommandInput,
  type DeleteCommandInput,
} from '@aws-sdk/lib-dynamodb'

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  }),
})

// Document client with marshalling/unmarshalling
export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
})

// ─── Table Names ────────────────────────────────────────────────
export const TABLES = {
  PLAYERS: process.env.DYNAMODB_TABLE_PLAYERS || 'TurfArena_Players',
  TEAMS: process.env.DYNAMODB_TABLE_TEAMS || 'TurfArena_Teams',
  TOURNAMENTS: process.env.DYNAMODB_TABLE_TOURNAMENTS || 'TurfArena_Tournaments',
  TURFS: process.env.DYNAMODB_TABLE_TURFS || 'TurfArena_Turfs',
  PLAYER_STATS: process.env.DYNAMODB_TABLE_PLAYER_STATS || 'TurfArena_PlayerStats',
  MATCHES: process.env.DYNAMODB_TABLE_MATCHES || 'TurfArena_Matches',
  BOOKINGS: process.env.DYNAMODB_TABLE_BOOKINGS || 'TurfArena_Bookings',
  LEADERBOARDS: process.env.DYNAMODB_TABLE_LEADERBOARDS || 'TurfArena_Leaderboards',
  REGISTRATIONS: process.env.DYNAMODB_TABLE_REGISTRATIONS || 'TurfArena_Registrations',
} as const

// ─── Helper Functions ───────────────────────────────────────────

export async function getItem<T>(tableName: string, key: Record<string, string | number>): Promise<T | null> {
  const params: GetCommandInput = {
    TableName: tableName,
    Key: key,
  }
  const result = await docClient.send(new GetCommand(params))
  return (result.Item as T) || null
}

export async function putItem(tableName: string, item: Record<string, unknown>): Promise<void> {
  const params: PutCommandInput = {
    TableName: tableName,
    Item: item,
  }
  await docClient.send(new PutCommand(params))
}

export async function queryItems<T>(
  tableName: string,
  keyConditionExpression: string,
  expressionValues: Record<string, unknown>,
  options?: {
    indexName?: string
    filterExpression?: string
    limit?: number
    scanIndexForward?: boolean
  }
): Promise<T[]> {
  const params: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionValues,
    ...(options?.indexName && { IndexName: options.indexName }),
    ...(options?.filterExpression && { FilterExpression: options.filterExpression }),
    ...(options?.limit && { Limit: options.limit }),
    ...(options?.scanIndexForward !== undefined && { ScanIndexForward: options.scanIndexForward }),
  }
  const result = await docClient.send(new QueryCommand(params))
  return (result.Items as T[]) || []
}

export async function scanItems<T>(
  tableName: string,
  options?: {
    filterExpression?: string
    expressionValues?: Record<string, unknown>
    expressionNames?: Record<string, string>
    limit?: number
  }
): Promise<T[]> {
  const params: ScanCommandInput = {
    TableName: tableName,
    ...(options?.filterExpression && { FilterExpression: options.filterExpression }),
    ...(options?.expressionValues && { ExpressionAttributeValues: options.expressionValues }),
    ...(options?.expressionNames && { ExpressionAttributeNames: options.expressionNames }),
    ...(options?.limit && { Limit: options.limit }),
  }
  const result = await docClient.send(new ScanCommand(params))
  return (result.Items as T[]) || []
}

export async function updateItem(
  tableName: string,
  key: Record<string, string | number>,
  updateExpression: string,
  expressionValues: Record<string, unknown>,
  expressionNames?: Record<string, string>
): Promise<Record<string, unknown>> {
  const params: UpdateCommandInput = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionValues,
    ...(expressionNames && { ExpressionAttributeNames: expressionNames }),
    ReturnValues: 'ALL_NEW',
  }
  const result = await docClient.send(new UpdateCommand(params))
  return result.Attributes || {}
}

export async function deleteItem(tableName: string, key: Record<string, string | number>): Promise<void> {
  const params: DeleteCommandInput = {
    TableName: tableName,
    Key: key,
  }
  await docClient.send(new DeleteCommand(params))
}
