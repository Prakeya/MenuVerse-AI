import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'

export async function PATCH(request: Request, { params }: { params: { restaurantId: string; orderId: string } }) {
  try {
    const { restaurantId, orderId } = params
    const body = await request.json()

    const updateExpressions: string[] = []
    const expressionAttributeValues: any = { ':orderId': orderId, ':restaurantId': restaurantId }

    Object.entries(body).forEach(([key, value]) => {
      updateExpressions.push(`${key} = :${key}`)
      expressionAttributeValues[`:${key}`] = value
    })

    const result = await db.send(new UpdateCommand({
      TableName: TABLES.ORDERS,
      Key: { restaurant_id: restaurantId, order_id: orderId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }))

    return NextResponse.json(result.Attributes)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}