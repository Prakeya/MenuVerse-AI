'use client'

import React from 'react'

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/4 rounded-md ${className}`} />
}

export default Skeleton
