import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, restaurant_id, customer_name } = body

    // Check if customer exists
    const result = await db.send(new QueryCommand({
      TableName: TABLES.LOYALTY,
      KeyConditionExpression: 'phone = :phone',
      ExpressionAttributeValues: {
        ':phone': phone,
      },
    }))

    const existingCustomer = result.Items?.[0]

    if (existingCustomer) {
      return NextResponse.json(existingCustomer)
    }

    // Create new customer
    const customer = {
      phone,
      restaurant_id,
      customer_name: customer_name || 'Guest',
      points: 0,
      visits: 0,
      created_at: new Date().toISOString(),
    }

    await db.send(new PutCommand({
      TableName: TABLES.LOYALTY,
      Item: customer,
    }))

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error identifying customer:', error)
    return NextResponse.json({ error: 'Failed to identify customer' }, { status: 500 })
  }
}