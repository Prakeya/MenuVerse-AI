'use client'

import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }

export function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center min-h-[44px] rounded-pill px-5 py-3 text-sm font-semibold transition duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed'
  const variants: Record<string, string> = {
    primary: 'bg-accent text-white border border-transparent hover:brightness-95 active:scale-[0.98]',
    secondary: 'bg-white text-primary border border-border hover:bg-[#FAFAFA]',
    ghost: 'bg-transparent text-primary border border-border hover:bg-[#FAFAFA]'
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export default Button
