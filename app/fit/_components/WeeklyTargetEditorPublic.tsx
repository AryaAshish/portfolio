'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FT } from '@/app/fittrack/_components/tokens'
import { updateWeeklyTargetAction } from '../body/actions'

const CHOICES = [1, 2, 3, 4, 5, 6, 7]

export function WeeklyTargetEditorPublic({ current }: { current: number }) {
  const router = useRouter()
  const [value, setValue] = useState(current)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSelect(n: number) {
    if (n === value || isPending) return
    setError(null)
    const prev = value
    setValue(n)
    startTransition(async () => {
      const r = await updateWeeklyTargetAction(n)
      if (!r.ok) { setValue(prev); setError(r.message); return }
      router.refresh()
    })
  }

  return (
    <div className="rounded-xl p-3" style={{ background: FT.surface, border: `1px solid ${FT.border}` }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: FT.textMuted }}>Weekly Gym Target</p>
        <p className="text-[10px]" style={{ color: FT.textMuted }}>Cardio & rest days don&apos;t count</p>
      </div>
      <div className="flex gap-1.5">
        {CHOICES.map((n) => {
          const active = n === value
          return (
            <button key={n} type="button" onClick={() => onSelect(n)} disabled={isPending} className="flex-1 text-sm font-semibold py-2 rounded-lg transition-colors" style={{ background: active ? FT.accent : FT.surface, color: active ? '#ffffff' : FT.textSecondary, border: `1px solid ${active ? FT.accent : FT.border}`, opacity: isPending ? 0.6 : 1 }}>{n}</button>
          )
        })}
      </div>
      {error && <p className="text-xs mt-2" style={{ color: FT.danger }}>{error}</p>}
    </div>
  )
}
