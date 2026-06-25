import { db } from "@/lib/dynamodb"
import { QueryCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { NextResponse } from "next/server"

function isMockMode() {
  return (
    !process.env.AWS_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID === "your_key_here" ||
    process.env.AWS_ACCESS_KEY_ID.trim() === ""
  )
}

// GET: Fetch loyalty profile for a customer
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const customer_id = searchParams.get("customer_id")
    const restaurant_id = searchParams.get("restaurant_id")

    if (!customer_id || !restaurant_id) {
      return NextResponse.json(
        { error: "Missing required parameters: customer_id, restaurant_id" },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock GET loyalty for customer: ${customer_id}`)
      return NextResponse.json({
        customer_id,
        restaurant_id,
        points: 0,
        tier: "Bronze",
        total_visits: 0,
        total_spent: 0
      })
    }

    const result = await db.send(new QueryCommand({
      TableName: "LoyaltyProfiles",
      KeyConditionExpression: "customer_id = :cid AND restaurant_id = :rid",
      ExpressionAttributeValues: {
        ":cid": customer_id,
        ":rid": restaurant_id
      }
    }))

    const profile = result.Items?.[0] || {
      customer_id,
      restaurant_id,
      points: 0,
      tier: "Bronze",
      total_visits: 0,
      total_spent: 0
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching loyalty profile:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Create or update loyalty profile
export async function POST(req) {
  try {
    const body = await req.json()
    const { customer_id, restaurant_id, points = 0, tier = "Bronze", total_visits = 0, total_spent = 0 } = body

    if (!customer_id || !restaurant_id) {
      return NextResponse.json(
        { error: "Missing required fields: customer_id, restaurant_id" },
        { status: 400 }
      )
    }

    const profile = {
      customer_id,
      restaurant_id,
      points: Number(points),
      tier,
      total_visits: Number(total_visits),
      total_spent: Number(total_spent),
      updated_at: new Date().toISOString()
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock POST loyalty for customer: ${customer_id}`)
      return NextResponse.json({
        message: "Loyalty profile saved successfully (Mock)",
        profile
      })
    }

    await db.send(new PutCommand({
      TableName: "LoyaltyProfiles",
      Item: profile
    }))

    return NextResponse.json({
      message: "Loyalty profile saved successfully",
      profile
    })
  } catch (error) {
    console.error("Error saving loyalty profile:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT: Add points to loyalty profile
export async function PUT(req) {
  try {
    const body = await req.json()
    const { customer_id, restaurant_id, points_to_add, visit_data } = body

    if (!customer_id || !restaurant_id || !points_to_add) {
      return NextResponse.json(
        { error: "Missing required fields: customer_id, restaurant_id, points_to_add" },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock PUT loyalty: Add ${points_to_add} points for ${customer_id}`)
      return NextResponse.json({
        message: "Points added successfully (Mock)",
        points_added: points_to_add
      })
    }

    // Get current profile
    const result = await db.send(new QueryCommand({
      TableName: "LoyaltyProfiles",
      KeyConditionExpression: "customer_id = :cid AND restaurant_id = :rid",
      ExpressionAttributeValues: {
        ":cid": customer_id,
        ":rid": restaurant_id
      }
    }))

    const currentProfile = result.Items?.[0] || {
      points: 0,
      tier: "Bronze",
      total_visits: 0,
      total_spent: 0
    }

    const newPoints = currentProfile.points + Number(points_to_add)
    const newTotalVisits = currentProfile.total_visits + 1
    const newTotalSpent = currentProfile.total_spent + (visit_data?.amount || 0)

    // Determine tier based on points
    let newTier = "Bronze"
    if (newPoints >= 1000) newTier = "Gold"
    else if (newPoints >= 500) newTier = "Silver"

    await db.send(new UpdateCommand({
      TableName: "LoyaltyProfiles",
      Key: {
        customer_id,
        restaurant_id
      },
      UpdateExpression: "SET points = :points, tier = :tier, total_visits = :visits, total_spent = :spent, updated_at = :updated",
      ExpressionAttributeValues: {
        ":points": newPoints,
        ":tier": newTier,
        ":visits": newTotalVisits,
        ":spent": newTotalSpent,
        ":updated": new Date().toISOString()
      }
    }))

    return NextResponse.json({
      message: "Points added successfully",
      points_added: points_to_add,
      new_total: newPoints,
      tier: newTier
    })
  } catch (error) {
    console.error("Error adding loyalty points:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}