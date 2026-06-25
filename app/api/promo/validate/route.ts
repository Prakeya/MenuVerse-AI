import { NextResponse } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { QueryCommand } from '@aws-sdk/lib-dynamodb'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, restaurant_id } = body

    // In a real app, you'd have a PromoCodes table
    // For now, we'll do a simple validation
    const validPromoCodes: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
      'WELCOME10': { discount: 10, type: 'percentage' },
      'SAVE5': { discount: 5, type: 'fixed' },
      'MENU20': { discount: 20, type: 'percentage' },
    }

    const promo = validPromoCodes[code.toUpperCase()]

    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Invalid promo code' }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      code: code.toUpperCase(),
      discount: promo.discount,
      type: promo.type,
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json({ error: 'Failed to validate promo code' }, { status: 500 })
  }
}