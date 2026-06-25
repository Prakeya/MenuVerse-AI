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

// GET: Fetch ratings for a restaurant or menu item
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const restaurant_id = searchParams.get("restaurant_id")
    const item_id = searchParams.get("item_id")

    if (!restaurant_id) {
      return NextResponse.json(
        { error: "Missing required parameter: restaurant_id" },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock GET ratings for restaurant: ${restaurant_id}`)
      return NextResponse.json([])
    }

    let result
    if (item_id) {
      // Query ratings for specific menu item
      result = await db.send(new QueryCommand({
        TableName: "Ratings",
        KeyConditionExpression: "restaurant_id = :rid AND item_id = :iid",
        ExpressionAttributeValues: {
          ":rid": restaurant_id,
          ":iid": item_id
        }
      }))
    } else {
      // Query all ratings for restaurant
      result = await db.send(new QueryCommand({
        TableName: "Ratings",
        KeyConditionExpression: "restaurant_id = :rid",
        ExpressionAttributeValues: { ":rid": restaurant_id }
      }))
    }

    return NextResponse.json(result.Items || [])
  } catch (error) {
    console.error("Error fetching ratings:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Submit a new rating
export async function POST(req) {
  try {
    const body = await req.json()
    const { restaurant_id, item_id, customer_id, rating, review } = body

    if (!restaurant_id || !customer_id || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: restaurant_id, customer_id, rating" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const rating_id = `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const created_at = new Date().toISOString()

    const ratingItem = {
      rating_id,
      restaurant_id,
      item_id: item_id || null,
      customer_id,
      rating: Number(rating),
      review: review || "",
      created_at
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock POST rating: ${rating_id}`)
      return NextResponse.json({
        message: "Rating submitted successfully (Mock)",
        rating: ratingItem
      })
    }

    await db.send(new PutCommand({
      TableName: "Ratings",
      Item: ratingItem
    }))

    // Update average rating for the item if item_id is provided
    if (item_id) {
      const allRatingsResult = await db.send(new QueryCommand({
        TableName: "Ratings",
        KeyConditionExpression: "restaurant_id = :rid AND item_id = :iid",
        ExpressionAttributeValues: {
          ":rid": restaurant_id,
          ":iid": item_id
        }
      }))

      const ratings = allRatingsResult.Items || []
      const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length

      // Update menu item with new average rating
      await db.send(new UpdateCommand({
        TableName: "MenuItems",
        Key: {
          restaurant_id,
          item_id
        },
        UpdateExpression: "SET avg_rating = :rating, rating_count = :count",
        ExpressionAttributeValues: {
          ":rating": Math.round(avgRating * 10) / 10,
          ":count": ratings.length
        }
      }))
    }

    return NextResponse.json({
      message: "Rating submitted successfully",
      rating: ratingItem
    })
  } catch (error) {
    console.error("Error submitting rating:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT: Update an existing rating
export async function PUT(req) {
  try {
    const body = await req.json()
    const { rating_id, restaurant_id, rating, review } = body

    if (!rating_id || !restaurant_id || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: rating_id, restaurant_id, rating" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    if (isMockMode()) {
      console.log(`[LOCAL DEV] Mock PUT rating: ${rating_id}`)
      return NextResponse.json({
        message: "Rating updated successfully (Mock)",
        rating_id
      })
    }

    await db.send(new UpdateCommand({
      TableName: "Ratings",
      Key: {
        restaurant_id,
        rating_id
      },
      UpdateExpression: "SET rating = :rating, review = :review, updated_at = :updated",
      ExpressionAttributeValues: {
        ":rating": Number(rating),
        ":review": review || "",
        ":updated": new Date().toISOString()
      }
    }))

    return NextResponse.json({
      message: "Rating updated successfully",
      rating_id
    })
  } catch (error) {
    console.error("Error updating rating:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}