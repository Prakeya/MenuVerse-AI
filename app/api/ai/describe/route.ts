import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, category } = body

    const OPENAI_KEY = process.env.OPENAI_API_KEY
    if (OPENAI_KEY) {
      try {
        const prompt = `Write a concise, appetizing menu description for a dish named "${name}" in the category "${category}". Tone: premium, appetizing, 1-2 sentences.`
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a helpful assistant that writes short menu descriptions.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 120,
            temperature: 0.8
          })
        })

        if (!res.ok) {
          const txt = await res.text()
          console.error('OpenAI error', res.status, txt)
          throw new Error('OpenAI request failed')
        }

        const data = await res.json()
        const description = data?.choices?.[0]?.message?.content?.trim()
        if (description) return NextResponse.json({ description })
      } catch (err) {
        console.error('OpenAI integration failed, falling back', err)
        // fallthrough to simulated response
      }
    }

    // Fallback simulated response
    await new Promise((res) => setTimeout(res, 500))
    const description = `${name} is a delightful ${category} prepared with fresh ingredients and balanced flavors — a customer favorite.`
    return NextResponse.json({ description })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 })
  }
}
