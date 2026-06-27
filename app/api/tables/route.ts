import { db } from "@/lib/dynamodb"
import { QueryCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { NextRequest, NextResponse } from "next/server"

function isMockMode(): boolean {
  return (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "your_key_here" ||
    process.env.AWS_ACCESS_KEY_ID.trim() === ""
  )
}

// GET: Fetch all tables for a restaurant
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const restaurant_id = searchParams.get("restaurant_id")

    if (!restaurant_id) {
      return NextResponse.json(
        { error: "Missing required parameter: restaurant_id" },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock GET tables for restaurant: ${restaurant_id}`)
      return NextResponse.json([])
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }

    const result = await db.send(new QueryCommand({
      TableName: "RestaurantTables",
      KeyConditionExpression: "restaurant_id = :rid",
      ExpressionAttributeValues: { ":rid": restaurant_id }
    }))

    return NextResponse.json((result.Items || []) as any[])
  } catch (error) {
    console.error("Error fetching tables:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// POST: Create a new table
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { restaurant_id, table_number, capacity, status = "available" } = body

    if (!restaurant_id || table_number === undefined || !capacity) {
      return NextResponse.json(
        { error: "Missing required fields: restaurant_id, table_number, capacity" },
        { status: 400 }
      )
    }

    const table_id = `table_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const table = {
      table_id,
      restaurant_id,
      table_number: Number(table_number),
      capacity: Number(capacity),
      status,
      created_at: new Date().toISOString()
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock POST table: ${table_id}`)
      return NextResponse.json({
        message: "Table created successfully (Mock)",
        table
      })
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }

    await db.send(new PutCommand({
      TableName: "RestaurantTables",
      Item: table
    }))

    return NextResponse.json({
      message: "Table created successfully",
      table
    })
  } catch (error) {
    console.error("Error creating table:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// PUT: Update table status
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { table_id, restaurant_id, status, current_order_id } = body

    if (!table_id || !restaurant_id) {
      return NextResponse.json(
        { error: "Missing required fields: table_id, restaurant_id" },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock PUT table: ${table_id}`)
      return NextResponse.json({
        message: "Table updated successfully (Mock)",
        table_id,
        status
      })
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }

    const updateExpressions: string[] = []
    const expressionValues: Record<string, any> = {}
    const expressionNames: Record<string, string> = {}

    if (status) {
      updateExpressions.push("#status = :status")
      expressionNames["#status"] = "status"
      expressionValues[":status"] = status
    }

    if (current_order_id !== undefined) {
      updateExpressions.push("current_order_id = :orderId")
      expressionValues[":orderId"] = current_order_id
    }

    if (updateExpressions.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    await db.send(new UpdateCommand({
      TableName: "RestaurantTables",
      Key: {
        restaurant_id,
        table_id
      },
      UpdateExpression: "SET " + updateExpressions.join(", "),
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues
    }))

    return NextResponse.json({
      message: "Table updated successfully",
      table_id,
      status
    })
  } catch (error) {
    console.error("Error updating table:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// DELETE: Delete a table
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const table_id = searchParams.get("table_id")
    const restaurant_id = searchParams.get("restaurant_id")

    if (!table_id || !restaurant_id) {
      return NextResponse.json(
        { error: "Missing required parameters: table_id, restaurant_id" },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock DELETE table: ${table_id}`)
      return NextResponse.json({ message: "Table deleted successfully (Mock)" })
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }

    await db.send(new DeleteCommand({
      TableName: "RestaurantTables",
      Key: {
        restaurant_id,
        table_id
      }
    }))

    return NextResponse.json({ message: "Table deleted successfully" })
  } catch (error) {
    console.error("Error deleting table:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
