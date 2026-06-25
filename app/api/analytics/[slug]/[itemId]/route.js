import { db } from "@/lib/dynamodb"
import { PutCommand } from "@aws-sdk/lib-dynamodb"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import mockAnalytics from "@/lib/mockAnalytics.json"

const mockFilePath = path.join(process.cwd(), "lib", "mockAnalytics.json")

function isMockMode() {
  return (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "your_key_here" ||
    process.env.AWS_ACCESS_KEY_ID.trim() === ""
  )
}

// POST: Track a view event for a menu item
export async function POST(req, { params }) {
  const resolvedParams = await params
  const { slug, itemId } = resolvedParams // slug = restaurant_id, itemId = item_id

  try {
    const timestamp = new Date().toISOString()
    const logEvent = {
      restaurant_id: slug,
      item_id: itemId,
      timestamp
    }

    if (isMockMode()) {
      let analytics = mockAnalytics
      try {
        if (fs.existsSync(mockFilePath)) {
          analytics = JSON.parse(fs.readFileSync(mockFilePath, "utf8"))
        }
      } catch (e) {
        console.error("Failed to read analytics file", e)
      }

      analytics.push(logEvent)

      try {
        fs.writeFileSync(mockFilePath, JSON.stringify(analytics, null, 2), "utf8")
      } catch (e) {
        console.error("Failed to save analytics view", e)
      }

      return NextResponse.json({ message: "View tracked successfully (Mock)", log: logEvent })
    }

    // Real AWS DynamoDB Mode (Table name: Analytics, Partition key: restaurant_id, Sort key: timestamp)
    await db.send(new PutCommand({
      TableName: "Analytics",
      Item: {
        restaurant_id: slug,
        item_id: itemId,
        timestamp,
        views: 1
      }
    }))

    return NextResponse.json({ message: "View tracked successfully in DynamoDB", log: logEvent })
  } catch (error) {
    console.error("Error logging view event:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
