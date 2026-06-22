import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'MenuVerse AI — Restaurant OS',
  description: 'AI-powered restaurant OS that turns every table into a cinematic dining experience.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#FFFEFB', color: '#1a1a1a', margin: 0, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}