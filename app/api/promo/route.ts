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

// GET: Fetch active promotions for a restaurant
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const restaurant_id = searchParams.get("restaurant_id")
    const promo_id = searchParams.get("promo_id")

    if (!restaurant_id) {
      return NextResponse.json(
        { error: "Missing required parameter: restaurant_id" },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock GET promotions for restaurant: ${restaurant_id}`)
      return NextResponse.json([])
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }

    let result
    if (promo_id) {
      result = await db.send(new QueryCommand({
        TableName: "Promotions",
        KeyConditionExpression: "restaurant_id = :rid AND promo_id = :pid",
        ExpressionAttributeValues: {
          ":rid": restaurant_id,
          ":pid": promo_id
        }
      }))
    } else {
      result = await db.send(new QueryCommand({
        TableName: "Promotions",
        KeyConditionExpression: "restaurant_id = :rid",
        ExpressionAttributeValues: { ":rid": restaurant_id }
      }))
    }

    return NextResponse.json((result.Items || []) as any[])
  } catch (error) {
    console.error("Error fetching promotions:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// POST: Create a new promotion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      restaurant_id,
      title,
      description,
      discount_type,
      discount_value,
      valid_from,
      valid_until,
      applicable_items = [],
      min_order_amount = 0,
      usage_limit
    } = body

    if (!restaurant_id || !title || !discount_type || !valid_from || !valid_until) {
      return NextResponse.json(
        { error: "Missing required fields: restaurant_id, title, discount_type, valid_from, valid_until" },
        { status: 400 }
      )
    }

    const promo_id = `promo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const created_at = new Date().toISOString()

    const promotion = {
      promo_id,
      restaurant_id,
      title,
      description: description || "",
      discount_type,
      discount_value: Number(discount_value),
      valid_from,
      valid_until,
      applicable_items,
      min_order_amount: Number(min_order_amount),
      usage_limit: usage_limit !== undefined ? Number(usage_limit) : null,
      usage_count: 0,
      is_active: true,
      created_at
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock POST promotion: ${promo_id}`)
      return NextResponse.json({
        message: "Promotion created successfully (Mock)",
        promotion
      })
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }

    await db.send(new PutCommand({
      TableName: "Promotions",
      Item: promotion
    }))

    return NextResponse.json({
      message: "Promotion created successfully",
      promotion
    })
  } catch (error) {
    console.error("Error creating promotion:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// PUT: Update a promotion
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { promo_id, restaurant_id, ...updates } = body

    if (!promo_id || !restaurant_id) {
      return NextResponse.json(
        { error: "Missing required fields: promo_id, restaurant_id" },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock PUT promotion: ${promo_id}`)
      return NextResponse.json({
        message: "Promotion updated successfully (Mock)",
        promo_id
      })
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }

    const updateExpressions: string[] = []
    const expressionValues: Record<string, any> = {}

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateExpressions.push(`${key} = :${key}`)
        expressionValues[`:${key}`] = updates[key]
      }
    })

    if (updateExpressions.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    await db.send(new UpdateCommand({
      TableName: "Promotions",
      Key: {
        restaurant_id,
        promo_id
      },
      UpdateExpression: "SET " + updateExpressions.join(", "),
      ExpressionAttributeValues: expressionValues
    }))

    return NextResponse.json({
      message: "Promotion updated successfully",
      promo_id
    })
  } catch (error) {
    console.error("Error updating promotion:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// DELETE: Delete a promotion
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const promo_id = searchParams.get("promo_id")
    const restaurant_id = searchParams.get("restaurant_id")

    if (!promo_id || !restaurant_id) {
      return NextResponse.json(
        { error: "Missing required parameters: promo_id, restaurant_id" },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock DELETE promotion: ${promo_id}`)
      return NextResponse.json({ message: "Promotion deleted successfully (Mock)" })
    }

    if (!db) {
      return NextResponse.json({ error: "DynamoDB client not initialized" }, { status: 500 })
    }

    await db.send(new DeleteCommand({
      TableName: "Promotions",
      Key: {
        restaurant_id,
        promo_id
      }
    }))

    return NextResponse.json({ message: "Promotion deleted successfully" })
  } catch (error) {
    console.error("Error deleting promotion:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
