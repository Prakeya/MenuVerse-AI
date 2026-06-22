import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const restaurantId = req.nextUrl.searchParams.get('restaurantId') || 'demo'

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      send({ type: 'connected', message: 'Real-time order stream connected' })

      const interval = setInterval(() => {
        const mockOrder = {
          type: 'new_order',
          orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
          restaurantId,
          items: ['Butter Chicken', 'Naan'],
          amount: 18.99,
          status: 'new',
          timestamp: new Date().toISOString()
        }
        send(mockOrder)
      }, 15000)

      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}