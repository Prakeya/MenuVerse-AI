import React from 'react'
import { useAuth } from '../../lib/auth'
import { useLocation } from 'wouter'

export default function SettingsPage() {
  const { user, signOut, restaurantId } = useAuth()
  const [, navigate] = useLocation()

  async function handleSignOut() {
    await signOut()
    navigate('/signin')
  }

  return (
    <section className="space-y-8 py-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[#84848C]">Settings</p>
        <h2 className="text-3xl font-semibold text-[#14141A]">Account</h2>
      </div>

      <div className="rounded-[24px] border border-[#ECECEC] bg-white p-6 shadow-[0_6px_18px_rgba(20,20,26,0.06)]">
        <h3 className="text-sm font-semibold text-[#14141A] mb-4">Profile</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-[14px] border border-[#ECECEC] px-4 py-3">
            <span className="text-xs text-[#84848C]">Name</span>
            <span className="text-sm font-medium text-[#14141A]">{user?.name ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between rounded-[14px] border border-[#ECECEC] px-4 py-3">
            <span className="text-xs text-[#84848C]">Email</span>
            <span className="text-sm font-medium text-[#14141A]">{user?.email ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between rounded-[14px] border border-[#ECECEC] px-4 py-3">
            <span className="text-xs text-[#84848C]">Restaurant ID</span>
            <span className="text-sm font-mono text-[#14141A]">{restaurantId}</span>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#ECECEC] bg-white p-6 shadow-[0_6px_18px_rgba(20,20,26,0.06)]">
        <h3 className="text-sm font-semibold text-[#E5484D] mb-4">Danger Zone</h3>
        <button
          onClick={handleSignOut}
          className="rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
        >
          Sign out
        </button>
      </div>
    </section>
  )
}
