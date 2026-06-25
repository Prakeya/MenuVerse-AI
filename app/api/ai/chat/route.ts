import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, context } = body

    const OPENAI_KEY = process.env.OPENAI_API_KEY

    if (OPENAI_KEY) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a helpful AI assistant for a restaurant management system. Help with menu suggestions, order management, and customer service.' },
              { role: 'user', content: message },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        })

        if (!res.ok) {
          const txt = await res.text()
          console.error('OpenAI error', res.status, txt)
          throw new Error('OpenAI request failed')
        }

        const data = await res.json()
        const reply = data?.choices?.[0]?.message?.content?.trim()
        if (reply) return NextResponse.json({ reply })
      } catch (err) {
        console.error('OpenAI integration failed, falling back', err)
      }
    }

    // Fallback response
    const fallbackReply = `I understand you're asking about: "${message}". In demo mode, I can help you with basic questions. For full AI capabilities, please configure your OpenAI API key.`
    return NextResponse.json({ reply: fallbackReply })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 })
  }
}