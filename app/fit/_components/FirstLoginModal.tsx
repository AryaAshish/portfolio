'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FT } from '@/app/fittrack/_components/tokens'

export function FirstLoginModal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [submitting, setSubmitting] = useState<'yes' | 'no' | null>(null)

  const shouldShow = searchParams?.get('first') === '1'
  if (!shouldShow) return null

  async function handleChoice(enabled: boolean) {
    setSubmitting(enabled ? 'yes' : 'no')
    try {
      const res = await fetch('/api/fit/default-landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      })
      if (!res.ok) {
        setSubmitting(null)
        return
      }
    } catch (err) {
      console.error(err)
      setSubmitting(null)
      return
    }
    router.replace('/fit')
    router.refresh()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: 'rgba(0, 0, 0, 0.55)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fit-first-login-title"
    >
      <div
        className="rounded-2xl max-w-sm w-full p-6 shadow-xl"
        style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
      >
        <h2
          id="fit-first-login-title"
          className="text-lg font-semibold mb-2"
          style={{ color: FT.textPrimary }}
        >
          Make FitTrack your default?
        </h2>
        <p className="text-sm mb-5 leading-relaxed" style={{ color: FT.textSecondary }}>
          Open the app and land here next time. You can change this later from your Plan screen.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleChoice(false)}
            disabled={submitting !== null}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
            style={{
              border: `1px solid ${FT.border}`,
              color: FT.textPrimary,
              background: 'transparent',
            }}
          >
            {submitting === 'no' ? 'Saving…' : 'Not now'}
          </button>
          <button
            onClick={() => handleChoice(true)}
            disabled={submitting !== null}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
            style={{ background: FT.accent, color: FT.surface }}
          >
            {submitting === 'yes' ? 'Saving…' : 'Yes, make default'}
          </button>
        </div>
      </div>
    </div>
  )
}
