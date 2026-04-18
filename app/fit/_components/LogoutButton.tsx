'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FT } from '@/app/fittrack/_components/tokens'

export function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleLogout() {
    setPending(true)
    try {
      await fetch('/api/fit/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error(err)
    }
    router.replace('/')
    router.refresh()
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
