import { db } from "@/lib/dynamodb"
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import mockOrders from "@/lib/mockOrders.json"

const mockFilePath = path.join(process.cwd(), "lib", "mockOrders.json")

function isMockMode(): boolean {
  return (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "your_key_here" ||
    process.env.AWS_ACCESS_KEY_ID.trim() === ""
  )
}

// GET: Fetch all orders for a specific restaurant
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams // slug = restaurant_id

  if (isMockMode()) {
    console.log(`[LOCAL DEV] Mock GET orders for restaurant: ${slug}`)
    
    let currentMockOrders = mockOrders
    try {
      if (fs.existsSync(mockFilePath)) {
        currentMockOrders = JSON.parse(fs.readFileSync(mockFilePath, "utf8"))
      }
    } catch (e) {
      console.error("Failed to read mock orders file, using memory fallback", e)
    }

    const filteredOrders = currentMockOrders.filter(order => order.restaurant_id === slug)
    filteredOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return NextResponse.json(filteredOrders)
  }

  try {
    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }
    const result = await db.send(new QueryCommand({
      TableName: "Orders",
      KeyConditionExpression: "restaurant_id = :rid",
      ExpressionAttributeValues: { ":rid": slug }
    }))

    const items = (result.Items || []) as any[]
    items.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error querying Orders from DynamoDB:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// POST: Place a new order for a specific restaurant
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams // slug = restaurant_id

  try {
    const body = await req.json()
    const { customer_name, items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required field: items (must be a non-empty array)" },
        { status: 400 }
      )
    }

    const order_id = `order_${Date.now()}`
    const created_at = new Date().toISOString()
    
    const total_amount = items.reduce((sum, item) => {
      const price = Number(item.price) || 0
      const quantity = Number(item.quantity) || 1
      return sum + (price * quantity)
    }, 0)

    const newOrder = {
      restaurant_id: slug,
      order_id,
      customer_name: customer_name || "Anonymous Customer",
      items: items.map(item => ({
        item_id: item.item_id,
        name: item.name,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0
      })),
      total_amount,
      status: "PENDING",
      created_at
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock POST order for restaurant: ${slug}, order: ${order_id}`)

      let currentMockOrders = mockOrders
      try {
        if (fs.existsSync(mockFilePath)) {
          currentMockOrders = JSON.parse(fs.readFileSync(mockFilePath, "utf8"))
        }
      } catch (e) {
        console.error("Failed to read mock orders file, using default array", e)
      }

      currentMockOrders.push(newOrder)
      fs.writeFileSync(mockFilePath, JSON.stringify(currentMockOrders, null, 2), "utf8")

      return NextResponse.json({
        message: "Order placed successfully (Mock)",
        order: newOrder
      })
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }
    await db.send(new PutCommand({
      TableName: "Orders",
      Item: newOrder
    }))

    return NextResponse.json({
      message: "Order placed successfully to DynamoDB",
      order: newOrder
    })
  } catch (error) {
    console.error("Error placing order:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
