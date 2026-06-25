import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

export async function GET(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId

    const result = await db.send(new ScanCommand({
      TableName: TABLES.LOYALTY,
      FilterExpression: 'restaurant_id = :rid',
      ExpressionAttributeValues: {
        ':rid': restaurantId,
      },
    }))

    const customers = result.Items || []

    // Sort by points descending
    const leaderboard = customers
      .sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
      .slice(0, 20)
      .map((c: any, index: number) => ({
        rank: index + 1,
        phone: c.phone,
        customer_name: c.customer_name,
        points: c.points || 0,
        visits: c.visits || 0,
      }))

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}