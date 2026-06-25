import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

function isConfigured() {
  const keyId = process.env.AWS_ACCESS_KEY_ID
  const secret = process.env.AWS_SECRET_ACCESS_KEY
  const region = process.env.AWS_REGION

  if (!keyId || keyId === "your_key_here" || keyId.trim() === "") return false
  if (!secret || secret === "your_secret_here" || secret.trim() === "") return false
  if (!region || region.trim() === "") return false

  return true
}

let client
let db

if (isConfigured()) {
  try {
    client = new DynamoDBClient({
      region: process.env.AWS_REGION,
    })
    db = DynamoDBDocumentClient.from(client)
    console.log("[DynamoDB] Client initialized successfully")
  } catch (error) {
    console.error("[DynamoDB] Failed to initialize client:", error)
    client = null
    db = null
  }
} else {
  console.log("[DynamoDB] Running in mock mode - credentials not configured")
  client = null
  db = null
}

export { db, client }
