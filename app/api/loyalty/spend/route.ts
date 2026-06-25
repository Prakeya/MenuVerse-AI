import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, amount, restaurant_id } = body

    // Get customer
    const result = await db.send(new QueryCommand({
      TableName: TABLES.LOYALTY,
      KeyConditionExpression: 'phone = :phone',
      ExpressionAttributeValues: {
        ':phone': phone,
      },
    }))

    const customer = result.Items?.[0]

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Calculate points (e.g., 1 point per dollar spent)
    const pointsEarned = Math.floor(amount)
    const updatedCustomer = {
      ...customer,
      points: (customer.points || 0) + pointsEarned,
      visits: (customer.visits || 0) + 1,
      last_visit: new Date().toISOString(),
    }

    await db.send(new UpdateCommand({
      TableName: TABLES.LOYALTY,
      Key: { phone },
      UpdateExpression: 'SET #name = :name, points = :points, visits = :visits, last_visit = :last_visit, updated_at = :updated_at',
      ExpressionAttributeNames: {
        '#name': 'customer_name',
      },
      ExpressionAttributeValues: {
        ':name': customer.customer_name,
        ':points': updatedCustomer.points,
        ':visits': updatedCustomer.visits,
        ':last_visit': updatedCustomer.last_visit,
        ':updated_at': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    }))

    return NextResponse.json({
      customer: updatedCustomer,
      pointsEarned,
      totalPoints: updatedCustomer.points,
    })
  } catch (error) {
    console.error('Error processing loyalty spend:', error)
    return NextResponse.json({ error: 'Failed to process loyalty spend' }, { status: 500 })
  }
}