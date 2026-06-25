import { NextRequest } from 'next/server'
import { db, TABLES } from '@/lib/dynamodb'
import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  const orderId = params.orderId

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      send({ type: 'connected', message: 'Real-time order stream connected' })

      // Poll for order updates every 3 seconds
      const interval = setInterval(async () => {
        try {
          // Scan for the specific order
          const result = await db.send(new ScanCommand({
            TableName: TABLES.ORDERS,
            FilterExpression: 'order_id = :oid',
            ExpressionAttributeValues: {
              ':oid': orderId,
            },
          }))

          const order = result.Items?.[0]

          if (order) {
            send({ type: 'order_update', order })
          }
        } catch (error) {
          console.error('SSE Error:', error)
          send({ type: 'error', message: 'Failed to fetch order updates' })
        }
      }, 3000)

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