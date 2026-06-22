import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles } from 'lucide-react'
import api from '../lib/api'

type Message = { role: 'ai' | 'user'; text: string }

const QUICK_REPLIES = [
  "What's your best dish?",
  "Any vegetarian options?",
  "What are today's specials?",
  "Do you have desserts?",
]

function formatText(text: string) {
  return text
    .split('\n')
    .map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return `<span key="${i}">${formatted}</span>`
    })
    .join('<br/>')
}

export default function AIWaiter({ restaurantId, onClose }: { restaurantId: string; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm your AI waiter 🍽️ Ask me anything about the menu — recommendations, dietary needs, pricing, or what pairs well together!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    const msg = text.trim()
    if (!msg || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const data = await api.aiChat(restaurantId, msg)
      setMessages((prev) => [...prev, { role: 'ai', text: data.reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: "I'm having a moment — please ask your server and they'll help!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-24 right-6 z-[91] w-[340px] max-h-[520px] flex flex-col overflow-hidden rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        style={{ background: '#fff' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ background: '#111' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <Sparkles size={14} className="text-[#F5A623]" />
              AI Waiter
            </div>
            <p className="text-[11px] text-white/40 mt-0.5">Powered by your live menu</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition">
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'items-start gap-2'}`}>
              {m.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0 mt-0.5 text-sm">✦</div>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#111] text-white rounded-br-sm'
                    : 'bg-[#F3F4F6] text-[#1A1A1A] rounded-bl-sm'
                }`}
                dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
              />
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0 text-sm">✦</div>
              <div className="bg-[#F3F4F6] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]"
                    animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#E5E7EB] bg-white text-[#1A1A1A] hover:bg-[#F9FAFB] transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-[#F3F4F6] flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask about the menu…"
            className="flex-1 text-sm px-4 py-2.5 rounded-full border border-[#E5E7EB] outline-none focus:border-[#111] transition bg-[#F9FAFB]"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-full bg-[#F5A623] flex items-center justify-center disabled:opacity-40 transition hover:brightness-105"
          >
            <Send size={14} color="#111" />
          </button>
        </div>
      </motion.div>
    </>
  )
}
