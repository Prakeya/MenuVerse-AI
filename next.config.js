/** @type {import('next').NextConfig} */
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3004'

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/api/menu/:slug', destination: `${BACKEND}/api/menu/:slug` },
      { source: '/api/menu/:slug/:itemId', destination: `${BACKEND}/api/menu/:slug/:itemId` },
      { source: '/api/orders/:slug', destination: `${BACKEND}/api/orders/:slug` },
      { source: '/api/analytics/:slug/popular', destination: `${BACKEND}/api/analytics/:slug/popular` },
      { source: '/api/analytics/:slug/:itemId', destination: `${BACKEND}/api/analytics/:slug/:itemId` }
    ]
  }
}

module.exports = nextConfig
