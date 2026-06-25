import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'

export async function GET(request: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const restaurantId = params.restaurantId

    // Fetch menu items
    const menuResult = await db.send(new ScanCommand({
      TableName: TABLES.MENU_ITEMS,
      FilterExpression: 'restaurant_id = :rid',
      ExpressionAttributeValues: {
        ':rid': restaurantId,
      },
    }))

    // Fetch recent orders
    const ordersResult = await db.send(new ScanCommand({
      TableName: TABLES.ORDERS,
      FilterExpression: 'restaurant_id = :rid',
      ExpressionAttributeValues: {
        ':rid': restaurantId,
      },
    }))

    const menuItems = menuResult.Items || []
    const orders = ordersResult.Items || []

    // Generate AI insights
    const insights = {
      menuCount: menuItems.length,
      availableItems: menuItems.filter((item: any) => item.available).length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0),
      popularItems: menuItems
        .filter((item: any) => item.badges?.includes('bestseller'))
        .slice(0, 5)
        .map((item: any) => item.name),
      suggestions: [
        'Consider adding seasonal specials to increase engagement',
        'Peak hours show high demand - ensure adequate staffing',
        'Customer favorites could be featured in promotions',
      ],
    }

    return NextResponse.json(insights)
  } catch (error) {
    console.error('Error fetching copilot data:', error)
    return NextResponse.json({ error: 'Failed to fetch copilot data' }, { status: 500 })
  }
}