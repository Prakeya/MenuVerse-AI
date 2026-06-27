import { db } from "@/lib/dynamodb"
import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import mockAnalytics from "@/lib/mockAnalytics.json"
import mockMenuItems from "@/lib/mockMenuItems.json"

const mockAnalyticsPath = path.join(process.cwd(), "lib", "mockAnalytics.json")
const mockMenuPath = path.join(process.cwd(), "lib", "mockMenuItems.json")

function isMockMode(): boolean {
  return (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "your_key_here" ||
    process.env.AWS_ACCESS_KEY_ID.trim() === ""
  )
}

// GET: Fetch popular dishes sorted by view count
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams // slug = restaurant_id

  try {
    let analyticsData: any[] = mockAnalytics
    let menuItems: any[] = mockMenuItems

    if (isMockMode()) {
      try {
        if (fs.existsSync(mockAnalyticsPath)) {
          analyticsData = JSON.parse(fs.readFileSync(mockAnalyticsPath, "utf8"))
        }
        if (fs.existsSync(mockMenuPath)) {
          menuItems = JSON.parse(fs.readFileSync(mockMenuPath, "utf8"))
        }
      } catch (e) {
        console.error("Failed to load mock files for analytics", e)
      }
    } else {
      // Real AWS DynamoDB Mode
      if (!db) {
        return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
      }

      const menuResult = await db.send(new QueryCommand({
        TableName: "MenuItems",
        KeyConditionExpression: "restaurant_id = :rid",
        ExpressionAttributeValues: { ":rid": slug }
      }))
      menuItems = (menuResult.Items || []) as any[]

      const analyticsResult = await db.send(new QueryCommand({
        TableName: "Analytics",
        KeyConditionExpression: "restaurant_id = :rid",
        ExpressionAttributeValues: { ":rid": slug }
      }))
      analyticsData = (analyticsResult.Items || []) as any[]
    }

    const restLogs = analyticsData.filter(log => log.restaurant_id === slug)

    const viewCounts: Record<string, number> = {}
    restLogs.forEach(log => {
      if (log.item_id) {
        viewCounts[log.item_id] = (viewCounts[log.item_id] || 0) + 1
      }
    })

    const popularDishes = menuItems.map(item => {
      return {
        ...item,
        views: viewCounts[item.item_id] || 0
      }
    })

    popularDishes.sort((a: any, b: any) => b.views - a.views)

    return NextResponse.json(popularDishes)
  } catch (error) {
    console.error("Error retrieving popular dishes:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
