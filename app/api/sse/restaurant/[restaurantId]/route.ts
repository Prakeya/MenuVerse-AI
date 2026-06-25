import { NextRequest } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { restaurantId: string } }) {
  const restaurantId = params.restaurantId

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      send({ type: 'connected', message: 'Real-time restaurant stream connected' })

      // Poll for new orders every 5 seconds
      const interval = setInterval(async () => {
        try {
          const result = await db.send(new ScanCommand({
            TableName: TABLES.ORDERS,
            FilterExpression: 'restaurant_id = :rid',
            ExpressionAttributeValues: {
              ':rid': restaurantId,
            },
          }))

          const orders = result.Items || []
          send({ type: 'orders_update', orders })
        } catch (error) {
          console.error('SSE Error:', error)
          send({ type: 'error', message: 'Failed to fetch updates' })
        }
      }, 5000)

      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}