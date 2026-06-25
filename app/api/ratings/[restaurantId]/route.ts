import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { QueryCommand, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

export async function GET(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId

    const result = await db.send(new ScanCommand({
      TableName: TABLES.RATINGS,
      FilterExpression: 'restaurant_id = :rid',
      ExpressionAttributeValues: {
        ':rid': restaurantId,
      },
    }))

    return NextResponse.json(result.Items || [])
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId
    const body = await request.json()

    const rating = {
      ...body,
      restaurant_id: restaurantId,
      rating_id: `rating_${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    await db.send(new PutCommand({
      TableName: TABLES.RATINGS,
      Item: rating,
    }))

    return NextResponse.json(rating, { status: 201 })
  } catch (error) {
    console.error('Error creating rating:', error)
    return NextResponse.json({ error: 'Failed to create rating' }, { status: 500 })
  }
}