import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { PutCommand } from '@aws-sdk/lib-dynamodb'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { restaurant_id, items } = body

    if (!restaurant_id || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    // Import items into DynamoDB
    const promises = items.map((item: any) => {
      const menuItem = {
        ...item,
        restaurant_id,
        item_id: item.item_id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
      }
      return db.send(new PutCommand({
        TableName: TABLES.MENU_ITEMS,
        Item: menuItem,
      }))
    })

    await Promise.all(promises)

    return NextResponse.json({
      success: true,
      imported: items.length,
      message: `Successfully imported ${items.length} menu items`,
    })
  } catch (error) {
    console.error('Error importing menu items:', error)
    return NextResponse.json({ error: 'Failed to import menu items' }, { status: 500 })
  }
}