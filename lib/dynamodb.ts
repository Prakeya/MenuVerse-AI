import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'

const region = process.env.AWS_REGION || 'us-east-1'
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const clientConfig: any = { region }

if (accessKeyId && secretAccessKey) {
  clientConfig.credentials = {
    accessKeyId,
    secretAccessKey,
  }
}

const ddbClient = new DynamoDBClient(clientConfig)
export const db = DynamoDBDocumentClient.from(ddbClient)

export const TABLES = {
  MENU_ITEMS: 'MenuItems',
  ORDERS: 'Orders',
  ANALYTICS: 'Analytics',
  TABLES: 'Tables',
  LOYALTY: 'Loyalty',
  RATINGS: 'Ratings',
}

export type { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand }