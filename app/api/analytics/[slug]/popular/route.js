import { db } from "@/lib/dynamodb"
import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import mockAnalytics from "@/lib/mockAnalytics.json"
import mockMenuItems from "@/lib/mockMenuItems.json"

const mockAnalyticsPath = path.join(process.cwd(), "lib", "mockAnalytics.json")
const mockMenuPath = path.join(process.cwd(), "lib", "mockMenuItems.json")

function isMockMode() {
  return (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "your_key_here" ||
    process.env.AWS_ACCESS_KEY_ID.trim() === ""
  )
}

// GET: Fetch popular dishes sorted by view count
export async function GET(req, { params }) {
  const resolvedParams = await params
  const { slug } = resolvedParams // slug = restaurant_id

  try {
    let analyticsData = mockAnalytics
    let menuItems = mockMenuItems

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
      const menuResult = await db.send(new QueryCommand({
        TableName: "MenuItems",
        KeyConditionExpression: "restaurant_id = :rid",
        ExpressionAttributeValues: { ":rid": slug }
      }))
      menuItems = menuResult.Items || []

      const analyticsResult = await db.send(new QueryCommand({
        TableName: "Analytics",
        KeyConditionExpression: "restaurant_id = :rid",
        ExpressionAttributeValues: { ":rid": slug }
      }))
      analyticsData = analyticsResult.Items || []
    }

    const restLogs = analyticsData.filter(log => log.restaurant_id === slug)

    const viewCounts = {}
    restLogs.forEach(log => {
      viewCounts[log.item_id] = (viewCounts[log.item_id] || 0) + 1
    })

    const popularDishes = menuItems.map(item => {
      return {
        ...item,
        views: viewCounts[item.item_id] || 0
      }
    })

    popularDishes.sort((a, b) => b.views - a.views)

    return NextResponse.json(popularDishes)
  } catch (error) {
    console.error("Error retrieving popular dishes:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
