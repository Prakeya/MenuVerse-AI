import { db } from "@/lib/dynamodb"
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import mockData from "@/lib/mockMenuItems.json"

const mockFilePath = path.join(process.cwd(), "lib", "mockMenuItems.json")

function isMockMode(): boolean {
  return (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "your_key_here" ||
    process.env.AWS_ACCESS_KEY_ID.trim() === ""
  )
}

// GET: Fetch all menu items for a specific restaurant
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams // slug = restaurant_id

  if (isMockMode()) {
    console.log(`[LOCAL DEV] Mock GET menu for restaurant: ${slug}`)
    
    let currentMockData = mockData
    try {
      if (fs.existsSync(mockFilePath)) {
        currentMockData = JSON.parse(fs.readFileSync(mockFilePath, "utf8"))
      }
    } catch (e) {
      console.error("Failed to read mock file, using memory fallback", e)
    }

    const filteredItems = currentMockData.filter((item: any) => item.restaurant_id === slug)
    return NextResponse.json(filteredItems)
  }

  try {
    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }
    const result = await db.send(new QueryCommand({
      TableName: "MenuItems",
      KeyConditionExpression: "restaurant_id = :rid",
      ExpressionAttributeValues: { ":rid": slug }
    }))

    return NextResponse.json((result.Items || []) as any[])
  } catch (error) {
    console.error("Error querying DynamoDB:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// POST: Add or Update a menu item for a specific restaurant
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams // slug = restaurant_id

  try {
    const body = await req.json()
    const { item_id, name, price, description, category } = body

    // Validation
    if (!item_id || !name || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: item_id, name, and price" },
        { status: 400 }
      )
    }

    let image_url = "/biryani.png"
    if (category === "Sides") {
      image_url = "/naan.png"
    } else if (category === "Starters") {
      image_url = "/tikka_masala.png"
    } else if (category === "Desserts" || category === "Beverages") {
      image_url = "/pizza.png"
    }

    const newItem = {
      restaurant_id: slug,
      item_id,
      name,
      price: Number(price),
      description: description || "",
      category: category || "Uncategorized",
      available: true,
      image_url
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock POST item for restaurant: ${slug}, item: ${item_id}`)

      let currentMockData = mockData
      try {
        if (fs.existsSync(mockFilePath)) {
          currentMockData = JSON.parse(fs.readFileSync(mockFilePath, "utf8"))
        }
      } catch (e) {
        console.error("Failed to read mock file for POST, using default mock data", e)
      }

      // Check if item already exists under this restaurant
      const itemIndex = currentMockData.findIndex(
        item => item.restaurant_id === slug && item.item_id === item_id
      )

      if (itemIndex > -1) {
        currentMockData[itemIndex] = newItem
      } else {
        currentMockData.push(newItem)
      }

      fs.writeFileSync(mockFilePath, JSON.stringify(currentMockData, null, 2), "utf8")

      return NextResponse.json({
        message: "Menu item saved successfully (Mock)",
        item: newItem
      })
    }

    // Real AWS DynamoDB Mode
    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }
    await db.send(new PutCommand({
      TableName: "MenuItems",
      Item: newItem
    }))

    return NextResponse.json({
      message: "Menu item saved successfully to DynamoDB",
      item: newItem
    })
  } catch (error) {
    console.error("Error saving menu item:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
