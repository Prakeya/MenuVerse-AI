'use client'

import { useState, useRef } from 'react'
import { Salad, Pizza } from 'lucide-react'

const QUICK_REPLIES = ["What's your best dish?", "Something vegetarian?", "What desserts do you have?", "I'm allergic to nuts"]

const RESPONSES: Record<string, string> = {
  "What's your best dish?": "Our **Butter Chicken** is a customer favourite! Tender chicken in a rich, creamy tomato-butter sauce. It's our most ordered dish.",
  "Something vegetarian?": `Absolutely! Try our **Caesar Salad** or **Margherita Pizza**. Both are vegetarian options our customers love.`,
  "What desserts do you have?": "Our **Chocolate Lava Cake** is a must-try! Warm chocolate cake with a molten center, served with vanilla bean ice cream. Also check out our Mango Lassi.",
  "I'm allergic to nuts": "Thank you for letting me know! Most of our dishes are nut-free, but please ask your server about specific ingredients when ordering. Our Caesar Salad and Margherita Pizza are generally safe options.",
}

export default function AIWaiter({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    { role: 'ai', text: "Hi, I'm your AI waiter. Ask me anything about the menu — dietary needs, recommendations, or what pairs well together!" }
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = (text: string) => {
    const msg = text.trim()
    if (!msg) return
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')

    setTimeout(() => {
      const reply = RESPONSES[msg] || `Great choice! **${msg}** sounds perfect. Our chefs will prepare it fresh for you. Is there anything else I can help with?`
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    }, 800)
  }

  const md = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
      <div style={{ position: 'fixed', bottom: 96, right: 24, width: 360, maxHeight: 480, zIndex: 91, background: 'white', borderRadius: 24, boxShadow: '0 12px 48px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="animate-slide-up">
        {/* Header */}
        <div style={{ background: '#111', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#F5A623', fontSize: 16 }}>✦</span> AI Waiter
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Powered by your menu</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'ai' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, marginRight: 8, marginTop: 4 }}>
                  <span style={{ color: '#F5A623', fontSize: 14 }}>✦</span>
                </div>
              )}
              <div style={{
                maxWidth: '80%', padding: '10px 14px', borderRadius: 16,
                background: m.role === 'user' ? '#111' : '#f3f4f6',
                color: m.role === 'user' ? 'white' : '#1a1a1a',
                fontSize: 13, lineHeight: 1.5,
                borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                borderBottomLeftRadius: m.role === 'ai' ? 4 : 16,
              }} dangerouslySetInnerHTML={{ __html: md(m.text) }} />
            </div>
          ))}
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_REPLIES.map(q => (
              <button key={q} onClick={() => handleSend(q)} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 12, color: '#1a1a1a' }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8 }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend(input)} placeholder="Ask about the menu..." style={{ flex: 1, padding: '10px 16px', borderRadius: 999, border: '1px solid #e5e7eb', outline: 'none', fontSize: 13 }} />
          <button onClick={() => handleSend(input)} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#F5A623', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>→</button>
        </div>
      </div>
    </>
  )
}