'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { redirect: false, email, password })
    setLoading(false)
    if ((res as any)?.ok) {
      window.location.href = '/dashboard'
    } else {
      alert('Sign in failed')
    }
  }

  async function demo() {
    setLoading(true)
    const res = await signIn('credentials', { redirect: false, email: 'admin@menuverse.ai', password: 'password123' })
    setLoading(false)
    if ((res as any)?.ok) window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8">
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-primary">Sign in to MenuVerse</h1>
            <p className="mt-2 text-sm leading-6 text-muted">Access your restaurant dashboard, orders, and AI menu tools.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-primary">Email</label>
              <input
                placeholder="admin@menuverse.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base w-full px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-primary">Password</label>
              <input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base w-full px-4 py-3"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" className="w-full sm:w-auto">{loading ? 'Signing in…' : 'Sign in'}</Button>
              <Button variant="secondary" type="button" onClick={demo} className="w-full sm:w-auto">
                {loading ? 'Loading…' : 'Demo account'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
