import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

export async function GET(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId

    const result = await db.send(new QueryCommand({
      TableName: TABLES.MENU_ITEMS,
      KeyConditionExpression: 'restaurant_id = :rid',
      ExpressionAttributeValues: {
        ':rid': restaurantId,
      },
    }))

    return NextResponse.json(result.Items || [])
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId
    const body = await request.json()

    const item = {
      ...body,
      restaurant_id: restaurantId,
      item_id: body.item_id || `item_${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    await db.send(new PutCommand({
      TableName: TABLES.MENU_ITEMS,
      Item: item,
    }))

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 })
  }
}