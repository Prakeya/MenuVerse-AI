/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        border: '#ECECEC',
        primary: '#14141A',
        muted: '#84848C',
        accent: '#E5484D',
        accentTint: '#FDEDEE',
        success: '#E8F5E9',
        successText: '#2E7D32',
        pending: '#FFF4E5',
        pendingText: '#B45309'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        brand: ['General Sans', 'Inter', 'sans-serif']
      },
      boxShadow: {
        card: '0 12px 24px rgba(20, 20, 26, 0.08)',
        soft: '0 6px 18px rgba(20, 20, 26, 0.06)'
      },
      borderRadius: {
        card: '20px',
        input: '12px',
        pill: '999px'
      }
    }
  },
  plugins: []
}
