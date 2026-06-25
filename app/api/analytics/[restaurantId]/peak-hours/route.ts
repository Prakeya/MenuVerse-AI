import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

export async function GET(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId

    const result = await db.send(new ScanCommand({
      TableName: TABLES.ANALYTICS,
      FilterExpression: 'restaurant_id = :rid',
      ExpressionAttributeValues: {
        ':rid': restaurantId,
      },
    }))

    const items = result.Items || []

    // Aggregate by hour
    const hourMap = new Map<number, number>()
    items.forEach((item: any) => {
      const date = new Date(item.timestamp)
      const hour = date.getHours()
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1)
    })

    const peakHours = Array.from(hourMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return NextResponse.json(peakHours)
  } catch (error) {
    console.error('Error fetching peak hours:', error)
    return NextResponse.json({ error: 'Failed to fetch peak hours' }, { status: 500 })
  }
}