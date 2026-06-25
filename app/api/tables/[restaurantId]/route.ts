import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { QueryCommand, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'

export async function GET(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId

    const result = await db.send(new QueryCommand({
      TableName: TABLES.TABLES,
      KeyConditionExpression: 'restaurant_id = :rid',
      ExpressionAttributeValues: {
        ':rid': restaurantId,
      },
    }))

    return NextResponse.json(result.Items || [])
  } catch (error) {
    console.error('Error fetching tables:', error)
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId
    const body = await request.json()

    const table = {
      ...body,
      restaurant_id: restaurantId,
      table_id: body.table_id || `T-${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    await db.send(new PutCommand({
      TableName: TABLES.TABLES,
      Item: table,
    }))

    return NextResponse.json(table, { status: 201 })
  } catch (error) {
    console.error('Error creating table:', error)
    return NextResponse.json({ error: 'Failed to create table' }, { status: 500 })
  }
}