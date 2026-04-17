'use client'

import { useState } from 'react'
import { FT } from './tokens'

export function DefaultLandingToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [saving, setSaving] = useState(false)

  async function toggle() {
    const next = !enabled
    const prev = enabled
    setSaving(true)
    setEnabled(next)
    try {
      const res = await fetch('/api/fittrack/default-landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: next }),
      })
      if (!res.ok) setEnabled(prev)
    } catch (err) {
      console.error(err)
      setEnabled(prev)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg p-3"
      style={{ border: `1px solid ${FT.border}`, background: FT.surface }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium" style={{ color: FT.textPrimary }}>
          Default landing on this device
        </div>
        <div className="text-xs mt-0.5" style={{ color: FT.textSecondary }}>
          Tap the installed app icon and open FitTrack directly.
        </div>
      </div>
      <button
        onClick={toggle}
        disabled={saving}
        aria-pressed={enabled}
        aria-label="Toggle default landing"
        className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0 disabled:opacity-60"
        style={{ background: enabled ? FT.accent : FT.border }}
      >
        <span
          className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: enabled ? 'translateX(1.375rem)' : 'translateX(0.125rem)' }}
        />
      </button>
    </div>
  )
}
