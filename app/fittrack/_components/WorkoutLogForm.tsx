'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LogWorkoutResult } from '../workouts/actions'
import { logMotraWorkoutFromForm } from '../workouts/actions'
import { FT, WORKOUT_COLORS } from './tokens'

type TypeChoice = 'auto' | 'push' | 'pull' | 'legs' | 'auxiliary' | 'cardio'
const TYPE_CHOICES: TypeChoice[] = ['auto', 'push', 'pull', 'legs', 'auxiliary', 'cardio']

export function WorkoutLogForm({ hasWorkoutToday }: { hasWorkoutToday: boolean }) {
  const [expanded, setExpanded] = useState(!hasWorkoutToday)
  const [text, setText] = useState('')
  const [typeChoice, setTypeChoice] = useState<TypeChoice>('auto')
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<LogWorkoutResult | null>(null)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setResult(null)
    const override = typeChoice === 'auto' ? null : typeChoice
    const r = await logMotraWorkoutFromForm(text, override)
    setResult(r)
    setPending(false)
    if (r.ok) {
      setText('')
      setTypeChoice('auto')
      setExpanded(false)
      router.refresh()
    }
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-full rounded-xl border-2 border-dashed py-3 text-sm font-semibold transition-colors"
        style={{ borderColor: FT.border, color: FT.textSecondary }}
      >
        + Log workout
      </button>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: FT.textMuted }}>
          Day type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_CHOICES.map((choice) => {
            const isActive = typeChoice === choice
            const wc = choice === 'auto' ? null : WORKOUT_COLORS[choice]
            const label = choice === 'auto' ? 'Auto' : wc!.label
            const activeBg = wc ? wc.text : FT.textPrimary
            const idleBg = wc ? wc.bg : FT.borderSubtle
            const idleText = wc ? wc.text : FT.textSecondary
            const border = wc ? wc.text : FT.textSecondary
            return (
              <button
                key={choice}
                type="button"
                onClick={() => setTypeChoice(choice)}
                disabled={pending}
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all"
                style={{
                  background: isActive ? activeBg : idleBg,
                  color: isActive ? '#fff' : idleText,
                  border: `1.5px solid ${border}`,
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        autoFocus
        className="w-full rounded-xl border p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
        style={{
          borderColor: FT.border,
          background: FT.surface,
          color: FT.textPrimary,
        }}
        placeholder="Paste Motra workout..."
        disabled={pending}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending || !text.trim()}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: FT.accent }}
        >
          {pending ? 'Saving...' : 'Log workout'}
        </button>
        <button
          type="button"
          onClick={() => { setExpanded(false); setText(''); setResult(null); setTypeChoice('auto') }}
          className="rounded-lg px-3 py-2 text-sm font-medium"
          style={{ color: FT.textMuted }}
        >
          Cancel
        </button>
      </div>
      {result && !result.ok && (
        <p className="text-sm" style={{ color: FT.danger }}>{result.message}</p>
      )}
      {result && result.ok && (
        <p className="text-sm" style={{ color: FT.success }}>Workout logged!</p>
      )}
    </form>
  )
}
