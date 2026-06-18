import React from 'react'

export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-pill border border-border bg-[#F8F8F8] px-3 py-1 text-xs font-semibold text-muted ${className}`}>
      {children}
    </span>
  )
}

export default Badge
