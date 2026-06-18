'use client'

import React from 'react'
import MenuManager from '../../../components/MenuManager'

export default function MenuPage() {
  return (
    <section className="space-y-8 py-6">
      <div className="rounded-[28px] border border-border bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Menu dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-primary">Menu Studio</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              A modern workspace for organizing dishes, editing descriptions, and adjusting your active menu.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {['Edit items', 'Organize categories', 'Live updates', 'AI descriptions'].map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-slate-50 px-4 py-2 text-sm font-medium text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <MenuManager />
    </section>
  )
}
