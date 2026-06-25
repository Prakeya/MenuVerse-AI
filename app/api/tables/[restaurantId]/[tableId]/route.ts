import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'

export async function PATCH(request: Request, { params }: { params: { restaurantId: string; tableId: string } }) {
  try {
    const { restaurantId, tableId } = params
    const body = await request.json()

    const updateExpressions: string[] = []
    const expressionAttributeValues: any = { ':tableId': tableId, ':restaurantId': restaurantId }

    Object.entries(body).forEach(([key, value]) => {
      updateExpressions.push(`${key} = :${key}`)
      expressionAttributeValues[`:${key}`] = value
    })

    const result = await db.send(new UpdateCommand({
      TableName: TABLES.TABLES,
      Key: { restaurant_id: restaurantId, table_id: tableId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }))

    return NextResponse.json(result.Attributes)
  } catch (error) {
    console.error('Error updating table:', error)
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { restaurantId: string; tableId: string } }) {
  try {
    const { restaurantId, tableId } = params

    await db.send(new DeleteCommand({
      TableName: TABLES.TABLES,
      Key: { restaurant_id: restaurantId, table_id: tableId },
    }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting table:', error)
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 })
  }
}