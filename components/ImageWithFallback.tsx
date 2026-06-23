'use client'

import { useState } from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  style?: React.CSSProperties
  className?: string
  fallbackSrc?: string
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  style, 
  className, 
  fallbackSrc = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      style={style} 
      className={className}
      onError={handleError}
    />
  )
}