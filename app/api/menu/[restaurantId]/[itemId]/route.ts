import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'

export async function PUT(request: Request, { params }: { params: { restaurantId: string; itemId: string } }) {
  try {
    const { restaurantId, itemId } = params
    const body = await request.json()

    const item = {
      restaurant_id: restaurantId,
      item_id: itemId,
      ...body,
      updated_at: new Date().toISOString(),
    }

    await db.send(new PutCommand({
      TableName: TABLES.MENU_ITEMS,
      Item: item,
    }))

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { restaurantId: string; itemId: string } }) {
  try {
    const { restaurantId, itemId } = params
    const body = await request.json()

    const updateExpressions: string[] = []
    const expressionAttributeValues: any = { ':itemId': itemId, ':restaurantId': restaurantId }

    Object.entries(body).forEach(([key, value]) => {
      updateExpressions.push(`${key} = :${key}`)
      expressionAttributeValues[`:${key}`] = value
    })

    const result = await db.send(new UpdateCommand({
      TableName: TABLES.MENU_ITEMS,
      Key: { restaurant_id: restaurantId, item_id: itemId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }))

    return NextResponse.json(result.Attributes)
  } catch (error) {
    console.error('Error patching menu item:', error)
    return NextResponse.json({ error: 'Failed to patch menu item' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { restaurantId: string; itemId: string } }) {
  try {
    const { restaurantId, itemId } = params

    await db.send(new DeleteCommand({
      TableName: TABLES.MENU_ITEMS,
      Key: { restaurant_id: restaurantId, item_id: itemId },
    }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 })
  }
}