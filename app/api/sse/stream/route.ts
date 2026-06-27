import { NextRequest, NextResponse } from "next/server"

// Store active SSE connections
const clients = new Set<{
  restaurant_id: string
  event_type: string
  controller: ReadableStreamDefaultController
  cleanup?: () => void
}>()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const restaurant_id = searchParams.get("restaurant_id")
    const event_type = searchParams.get("event_type") || "all"

    if (!restaurant_id) {
      return NextResponse.json(
        { error: "Missing required parameter: restaurant_id" },
        { status: 400 }
      )
    }

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      start(controller) {
        const client = {
          restaurant_id,
          event_type,
          controller
        }
        clients.add(client)

        // Send initial connection message
        const encoder = new TextEncoder()
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "connected", message: "SSE connection established" })}\n\n`)
        )

        // Keep-alive ping every 30 seconds
        const keepAlive = setInterval(() => {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "ping", timestamp: new Date().toISOString() })}\n\n`)
            )
          } catch (error) {
            clearInterval(keepAlive)
            clients.delete(client)
          }
        }, 30000)

        // Store cleanup function
        client.cleanup = () => {
          clearInterval(keepAlive)
          clients.delete(client)
        }
      },
      cancel() {
        // Remove client when connection closes
        const client = Array.from(clients).find(c => c.controller === (this as ReadableStreamDefaultController))
        if (client) {
          clients.delete(client)
          if (client.cleanup) client.cleanup()
        }
      }
    })

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
      }
    })
  } catch (error) {
    console.error("Error establishing SSE connection:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

// POST: Send event to connected clients
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { restaurant_id, event_type, data } = body

    if (!restaurant_id || !event_type || !data) {
      return NextResponse.json(
        { error: "Missing required fields: restaurant_id, event_type, data" },
        { status: 400 }
      )
    }

    const encoder = new TextEncoder()
    const message = `data: ${JSON.stringify({ type: event_type, data, timestamp: new Date().toISOString() })}\n\n`

    // Send to all connected clients for this restaurant
    let sentCount = 0
    clients.forEach(client => {
      if (client.restaurant_id === restaurant_id &&
          (client.event_type === "all" || client.event_type === event_type)) {
        try {
          client.controller.enqueue(encoder.encode(message))
          sentCount++
        } catch (error) {
          console.error("Error sending to client:", error)
          clients.delete(client)
        }
      }
    })

    return NextResponse.json({
      message: "Event broadcasted successfully",
      recipients: sentCount
    })
  } catch (error) {
    console.error("Error broadcasting SSE event:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
