import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

export async function POST(request: Request, { params }: { params: { restaurantId: string; itemId: string } }) {
  try {
    const { restaurantId, itemId } = params
    const body = await request.json()

    const analyticsItem = {
      restaurant_id: restaurantId,
      item_id: itemId,
      event_type: 'view',
      timestamp: new Date().toISOString(),
      ...body,
    }

    await db.send(new PutCommand({
      TableName: TABLES.ANALYTICS,
      Item: analyticsItem,
    }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 })
  }
}