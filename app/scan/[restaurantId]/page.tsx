import React from 'react'

export default function ScanPage(props: any) {
  const params = props.params as { restaurantId: string }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-4">Scan — {params.restaurantId}</h2>
      <div className="rounded-2xl bg-card p-6 shadow">QR scan + import experience placeholder.</div>
    </section>
  )
}
