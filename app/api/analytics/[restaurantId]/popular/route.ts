import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

export async function GET(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId

    const result = await db.send(new ScanCommand({
      TableName: TABLES.ANALYTICS,
      FilterExpression: 'restaurant_id = :rid AND event_type = :etype',
      ExpressionAttributeValues: {
        ':rid': restaurantId,
        ':etype': 'view',
      },
    }))

    const items = result.Items || []

    // Aggregate views by item_id
    const popularMap = new Map<string, { item_id: string; views: number }>()
    items.forEach((item: any) => {
      const itemId = item.item_id
      popularMap.set(itemId, (popularMap.get(itemId) || { item_id: itemId, views: 0 }) as any)
      popularMap.get(itemId)!.views++
    })

    const popular = Array.from(popularMap.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    return NextResponse.json(popular)
  } catch (error) {
    console.error('Error fetching popular items:', error)
    return NextResponse.json({ error: 'Failed to fetch popular items' }, { status: 500 })
  }
}