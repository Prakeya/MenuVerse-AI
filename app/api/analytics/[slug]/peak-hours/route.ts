import { db } from "@/lib/dynamodb"
import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import mockAnalytics from "@/lib/mockAnalytics.json"

const mockAnalyticsPath = path.join(process.cwd(), "lib", "mockAnalytics.json")

function isMockMode(): boolean {
  return (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "your_key_here" ||
    process.env.AWS_ACCESS_KEY_ID.trim() === ""
  )
}

// GET: Fetch views grouped by hour of the day (0-23)
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams // slug = restaurant_id

  try {
    let analyticsLogs: any[] = mockAnalytics

    if (isMockMode()) {
      try {
        if (fs.existsSync(mockAnalyticsPath)) {
          analyticsLogs = JSON.parse(fs.readFileSync(mockAnalyticsPath, "utf8"))
        }
      } catch (e) {
        console.error("Failed to read mock analytics file", e)
      }
    } else {
      // Real AWS DynamoDB Mode
      if (!db) {
        return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
      }
      const result = await db.send(new QueryCommand({
        TableName: "Analytics",
        KeyConditionExpression: "restaurant_id = :rid",
        ExpressionAttributeValues: { ":rid": slug }
      }))
      analyticsLogs = (result.Items || []) as Array<{ restaurant_id: string; item_id?: string; timestamp: string }>
    }

    const restLogs = analyticsLogs.filter(log => log.restaurant_id === slug)

    const hourlyBins = Array.from({ length: 24 }, (_, i) => {
      const displayHour = i === 0 ? "12 AM" : i === 12 ? "12 PM" : i > 12 ? `${i - 12} PM` : `${i} AM`
      return {
        rawHour: i,
        hour: displayHour,
        views: 0
      }
    })

    restLogs.forEach(log => {
      if (!log.timestamp) return
      
      const date = new Date(log.timestamp)
      const hour = date.getHours()
      
      if (hour >= 0 && hour < 24) {
        hourlyBins[hour].views += 1
      }
    })

    return NextResponse.json(hourlyBins)
  } catch (error) {
    console.error("Error retrieving peak hours:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
