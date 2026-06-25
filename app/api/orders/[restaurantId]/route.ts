import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { QueryCommand, ScanCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

export async function GET(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId

    const result = await db.send(new ScanCommand({
      TableName: TABLES.ORDERS,
      FilterExpression: 'restaurant_id = :rid',
      ExpressionAttributeValues: {
        ':rid': restaurantId,
      },
    }))

    return NextResponse.json(result.Items || [])
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId
    const body = await request.json()

    const order = {
      ...body,
      restaurant_id: restaurantId,
      order_id: body.order_id || `ORD-${Date.now().toString(36).toUpperCase()}`,
      created_at: new Date().toISOString(),
    }

    await db.send(new PutCommand({
      TableName: TABLES.ORDERS,
      Item: order,
    }))

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}