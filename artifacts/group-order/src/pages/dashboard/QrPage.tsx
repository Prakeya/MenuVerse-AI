import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../../lib/auth'
import { Copy, ExternalLink, Download, Check } from 'lucide-react'

export default function QrPage() {
  const { restaurantId } = useAuth()
  const [copied, setCopied] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const menuUrl = `${origin}${base}/menu/${restaurantId}`

  function copy() {
    navigator.clipboard.writeText(menuUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function downloadQR() {
    const svg = document.getElementById('qr-svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 400, 400)
      ctx.drawImage(img, 0, 0, 400, 400)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `menuverse-qr-${restaurantId}.png`
      a.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)))
  }

  return (
    <section className="space-y-6 py-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#84848C]">QR Codes</p>
        <h2 className="text-3xl font-semibold text-[#14141A] mt-1">Share your menu</h2>
        <p className="text-sm text-[#84848C] mt-1 max-w-lg">
          Print this QR code and place it on every table. Customers scan to browse your live menu and order instantly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR card */}
        <div className="rounded-[24px] border border-[#ECECEC] bg-white p-8 shadow-[0_6px_18px_rgba(20,20,26,0.06)] flex flex-col items-center gap-6">
          <div className="p-5 rounded-[20px] border border-[#ECECEC] bg-[#FAFAFA]">
            <QRCodeSVG
              id="qr-svg"
              value={menuUrl}
              size={180}
              bgColor="transparent"
              fgColor="#111111"
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="text-center w-full">
            <p className="text-sm font-semibold text-[#14141A]">Restaurant Menu QR</p>
            <p className="mt-1 text-xs text-[#84848C] font-mono break-all max-w-[280px] mx-auto leading-5">{menuUrl}</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={copy}
              className="flex items-center gap-2 rounded-full border border-[#ECECEC] bg-white px-4 py-2.5 text-xs font-semibold text-[#14141A] hover:bg-[#FAFAFA] transition"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <button
              onClick={downloadQR}
              className="flex items-center gap-2 rounded-full border border-[#ECECEC] bg-white px-4 py-2.5 text-xs font-semibold text-[#14141A] hover:bg-[#FAFAFA] transition"
            >
              <Download size={13} /> Download PNG
            </button>
            <a
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#E5484D] px-4 py-2.5 text-xs font-semibold text-white hover:brightness-95 transition no-underline"
            >
              <ExternalLink size={13} /> Open menu
            </a>
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <div className="rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_12px_rgba(20,20,26,0.04)]">
            <h3 className="text-sm font-semibold text-[#14141A] mb-4">Your restaurant links</h3>
            <div className="space-y-2">
              {[
                { label: 'Customer Menu', path: menuUrl },
                { label: 'Dashboard', path: `${origin}${base}/dashboard` },
              ].map((l) => (
                <div key={l.label} className="flex items-center justify-between gap-3 rounded-[14px] border border-[#ECECEC] px-4 py-3">
                  <span className="text-sm text-[#14141A]">{l.label}</span>
                  <a
                    href={l.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#E5484D] hover:underline no-underline"
                  >
                    Open →
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#ECECEC] bg-white p-6 shadow-[0_4px_12px_rgba(20,20,26,0.04)]">
            <h3 className="text-sm font-semibold text-[#14141A] mb-4">💡 Tips for more orders</h3>
            <div className="space-y-3">
              {[
                'Print the QR and laminate it — place on every table.',
                'Add the menu link to Instagram and Google Business.',
                'Include the QR on your receipts and packaging.',
                'Share the link on WhatsApp with regular customers.',
              ].map((tip, i) => (
                <div key={i} className="flex gap-2.5 text-xs text-[#6B7280] leading-5">
                  <span className="text-[#E5484D] font-bold shrink-0">→</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
