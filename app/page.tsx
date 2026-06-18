'use client'

import React from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Home() {
  return (
    <section className="py-12">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Restaurant OS</p>
            <h1 className="text-5xl font-semibold text-primary leading-tight">Build a beautiful menu experience with AI.</h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              Turn any paper or digital menu into a live customer-facing experience, complete with smart recommendations, orders, and QR sharing.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button className="rounded-pill px-6 py-4" onClick={() => window.location.assign('/dashboard')}>
              Get started
            </Button>
            <Button variant="ghost" className="rounded-pill px-6 py-4">Watch demo</Button>
          </div>
        </div>

        <Card className="p-8">
          <div className="space-y-5">
            <div className="rounded-[28px] border border-border bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-muted">AI Menu Import</p>
              <p className="mt-3 text-base text-primary">Upload an image or PDF and instantly extract dishes, prices, and descriptions.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Live updates', 'AI descriptions', 'Order-ready pricing', 'QR sharing'].map((item) => (
                <div key={item} className="rounded-[24px] border border-border bg-white px-4 py-4 text-sm text-primary">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
