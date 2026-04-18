'use client'

import { useState } from 'react'
import { FT } from '@/app/fittrack/_components/tokens'

export function DefaultLandingToggle({ initial }: { initial: boolean }) {
  const [enabled, setEnabled] = useState(initial)
  const [pending, setPending] = useState(false)

  async function toggle() {
    const next = !enabled
    setPending(true)
    try {
      await fetch('/api/fit/default-landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: next }),
      })
      setEnabled(next)
    } catch (err) {
      console.error(err)
    }
    setPending(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className="flex items-center gap-2 text-xs disabled:opacity-50"
      style={{ color: FT.textSecondary }}
    >
      <span
        className="inline-block w-8 h-[18px] rounded-full relative transition-colors"
        style={{ background: enabled ? FT.accent : FT.border }}
      >
        <span
          className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform"
          style={{ left: enabled ? '14px' : '2px' }}
        />
      </span>
      Default landing page
    </button>
  )
}
