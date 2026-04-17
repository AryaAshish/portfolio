'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FT } from './tokens'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/fittrack/logout', { method: 'POST' })
    } catch (err) {
      console.error(err)
    }
    router.replace('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-[11px] font-medium ml-auto disabled:opacity-60"
      style={{ color: FT.textSecondary }}
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
