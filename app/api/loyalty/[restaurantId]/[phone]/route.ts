import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

export async function GET(request: Request, { params }: { params: { restaurantId: string; phone: string } }) {
  try {
    const { phone } = params

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

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error fetching loyalty customer:', error)
    return NextResponse.json({ error: 'Failed to fetch loyalty customer' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { restaurantId: string; phone: string } }) {
  try {
    const { phone } = params
    const body = await request.json()

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

    const updatedCustomer = {
      ...customer,
      ...body,
      phone,
    }

    await db.send(new UpdateCommand({
      TableName: TABLES.LOYALTY,
      Key: { phone },
      UpdateExpression: 'SET #name = :name, points = :points, visits = :visits, updated_at = :updated_at',
      ExpressionAttributeNames: {
        '#name': 'customer_name',
      },
      ExpressionAttributeValues: {
        ':name': updatedCustomer.customer_name,
        ':points': updatedCustomer.points,
        ':visits': updatedCustomer.visits,
        ':updated_at': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    }))

    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error('Error updating loyalty customer:', error)
    return NextResponse.json({ error: 'Failed to update loyalty customer' }, { status: 500 })
  }
}