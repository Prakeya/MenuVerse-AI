'use client'

import React, { useState } from 'react'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  { key: 'upload', label: 'Uploading Menu...' },
  { key: 'analyze', label: 'Analyzing Menu...' },
  { key: 'extract', label: 'Extracting Dishes...' },
  { key: 'describe', label: 'Generating Descriptions...' },
  { key: 'create', label: 'Creating Menu...' },
  { key: 'done', label: 'Complete!' }
]

export default function ImportPage() {
  const [uploading, setUploading] = useState(false)
  const [currentStep, setCurrentStep] = useState<number>(-1)

  async function handleUpload() {
    setUploading(true)
    setCurrentStep(0)

    for (let i = 0; i < steps.length; i++) {
      await new Promise((res) => setTimeout(res, 900))
      setCurrentStep(i + 1)
    }

    setUploading(false)
    setTimeout(() => setCurrentStep(-1), 500)
  }

  return (
    <section className="space-y-8 py-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">AI import</p>
        <h2 className="text-3xl font-semibold text-primary">Turn menus into ready-to-publish dishes</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted">Upload a menu image or PDF and let the AI extract, describe, and organize dishes automatically.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-8">
          {currentStep === -1 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group cursor-pointer rounded-[28px] border border-dashed border-border bg-slate-50 p-16 text-center transition hover:border-accent/60"
            >
              <div className="text-6xl mb-4">📸</div>
              <div className="text-xl font-semibold text-primary mb-2">Drag & drop your menu</div>
              <p className="text-sm text-muted mb-6">JPG, PNG, or PDF up to 10MB</p>
              <Button onClick={handleUpload}>Upload menu</Button>
            </motion.div>
          ) : currentStep < steps.length ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-center gap-4 rounded-[24px] border border-border bg-white px-4 py-4"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                      idx < currentStep ? 'bg-primary text-black' : idx === currentStep ? 'bg-accent text-black' : 'bg-slate-100 text-muted'
                    }`}
                  >
                    {idx < currentStep ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div className={idx <= currentStep ? 'text-primary font-semibold' : 'text-muted'}>{step.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[28px] bg-slate-50 p-10 text-center">
              <div className="text-5xl mb-4">✨</div>
              <div className="text-xl font-semibold text-primary mb-2">Menu imported successfully</div>
              <p className="text-sm text-muted mb-6">12 dishes were extracted and are ready to publish.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="ghost" onClick={() => setCurrentStep(-1)}>
                  Import another
                </Button>
                <Button onClick={() => (window.location.href = '/dashboard/menu')}>View menu</Button>
              </div>
            </motion.div>
          )}
        </Card>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          {[
            { title: 'Fast results', subtitle: 'Extract menus in seconds' },
            { title: 'AI smart labels', subtitle: 'Dish categories created automatically' },
            { title: 'Live updates', subtitle: 'Changes appear instantly in the customer menu' }
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <div className="text-sm font-semibold text-primary mb-2">{item.title}</div>
              <p className="text-sm text-muted">{item.subtitle}</p>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
