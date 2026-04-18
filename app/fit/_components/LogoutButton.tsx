'use client'

import { useState } from 'react'
import { FT } from '@/app/fittrack/_components/tokens'

export function LogoutButton() {
  const [pending, setPending] = useState(false)

  async function handleLogout() {
    setPending(true)
    try {
      const res = await fetch('/api/fit/auth/logout', { method: 'POST' })
      if (!res.ok) {
        setPending(false)
        return
      }
    } catch (err) {
      console.error(err)
      setPending(false)
      return
    }
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      className="ml-auto text-[11px] font-medium disabled:opacity-50"
      style={{ color: FT.textMuted }}
    >
      {pending ? 'Logging out…' : 'Logout'}
    </button>
  )
}
