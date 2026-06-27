'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFEFB', padding: 24 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <span style={{ fontSize: 28, color: 'white' }}>!</span>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' }}>Something went wrong</h1>
      <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px', textAlign: 'center', maxWidth: 400 }}>
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        style={{ padding: '12px 24px', borderRadius: 999, border: 'none', background: '#111', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  )
}