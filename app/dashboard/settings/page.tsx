'use client'

import React, { useState } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ name: 'Demo Restaurant', address: '123 Main St', phone: '555-0100' })

  async function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <section className="space-y-8 py-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Business settings</p>
        <h2 className="text-3xl font-semibold text-primary">Restaurant profile</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted">Update your restaurant details, branding, and customer-facing contact info.</p>
      </div>

      <Card className="max-w-2xl space-y-6 p-8">
        <div className="grid gap-6">
          {[
            { label: 'Restaurant Name', value: form.name, key: 'name' },
            { label: 'Address', value: form.address, key: 'address' },
            { label: 'Phone Number', value: form.phone, key: 'phone' }
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-primary">{field.label}</label>
              <input
                value={field.value}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="input-base w-full px-4 py-3"
              />
            </div>
          ))}
        </div>

        <motion.div layout className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setForm({ ...form, name: 'Demo Restaurant', address: '123 Main St', phone: '555-0100' })}>
            Reset
          </Button>
          <Button onClick={save}>{saved ? 'Saved' : 'Save changes'}</Button>
        </motion.div>
      </Card>
    </section>
  )
}
