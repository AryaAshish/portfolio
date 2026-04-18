'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type {
  LogWorkoutConflictMode,
  LogWorkoutExisting,
  LogWorkoutResult,
} from '../workouts/types'
import { logMotraWorkoutFromForm } from '../workouts/actions'
import { FT, WORKOUT_COLORS } from '@/app/fittrack/_components/tokens'

type TypeChoice = 'auto' | 'push' | 'pull' | 'legs' | 'auxiliary' | 'cardio' | 'rest'
const TYPE_CHOICES: TypeChoice[] = ['auto', 'push', 'pull', 'legs', 'auxiliary', 'cardio', 'rest']

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatDateLabel(iso: string): string {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short',
    })
  } catch { return iso }
}

export function WorkoutLogFormPublic({ hasWorkoutToday }: { hasWorkoutToday: boolean }) {
  const [expanded, setExpanded] = useState(!hasWorkoutToday)
  const [text, setText] = useState('')
  const [typeChoice, setTypeChoice] = useState<TypeChoice>('auto')
  const [date, setDate] = useState<string>(todayISO())
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<LogWorkoutResult | null>(null)
  const [conflict, setConflict] = useState<LogWorkoutExisting | null>(null)
  const router = useRouter()

  const today = todayISO()
  const isToday = date === today

  async function submit(mode: LogWorkoutConflictMode | null) {
    setPending(true)
    setResult(null)
    const override = typeChoice === 'auto' ? null : typeChoice
    const r = await logMotraWorkoutFromForm(text, override, date, mode)
    setPending(false)

    if (r.ok) {
      setResult(r)
      setConflict(null)
      setText('')
      setTypeChoice('auto')
      setDate(todayISO())
      setExpanded(false)
      router.refresh()
      return
    }

    if ('existing' in r) {
      setConflict(r.existing)
      setResult(null)
      return
    }

    setConflict(null)
    setResult(r)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await submit(null)
  }

  function resetAndCollapse() {
    setExpanded(false)
    setText('')
    setResult(null)
    setTypeChoice('auto')
    setDate(todayISO())
    setConflict(null)
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
        <div className="flex items-baseline justify-between mb-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: FT.textMuted }}>
            Workout date
          </p>
          {isToday && (
            <span className="text-[10px] uppercase tracking-wide" style={{ color: FT.textMuted }}>Today</span>
          )}
        </div>
        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) => { setDate(e.target.value); setConflict(null) }}
          disabled={pending}
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: FT.textMuted }}>Day type</p>
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
        style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
        placeholder="Paste Motra workout..."
        disabled={pending}
      />

      {conflict ? (
        <div className="rounded-xl p-3 space-y-2" style={{ background: FT.warningBg, border: `1px solid ${FT.warning}40` }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: FT.textPrimary }}>
              Already logged on {formatDateLabel(conflict.date)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: FT.textSecondary }}>
              {conflict.title || 'Untitled workout'} &middot; {conflict.type}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={pending} onClick={() => { setPending(true); router.push(`/fit/train/${conflict.id}/edit`) }}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: FT.accent, color: '#fff' }}>Edit existing</button>
            <button type="button" disabled={pending} onClick={() => submit('override')}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: FT.danger, color: '#fff' }}>Override</button>
            <button type="button" disabled={pending} onClick={() => submit('add')}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: FT.surface, color: FT.textPrimary, border: `1px solid ${FT.border}` }}>Add as extra</button>
            <button type="button" disabled={pending} onClick={() => setConflict(null)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ color: FT.textMuted }}>Back</button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button type="submit" disabled={pending || !text.trim()}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40" style={{ background: FT.accent }}>
            {pending ? 'Saving...' : 'Log workout'}
          </button>
          <button type="button" onClick={resetAndCollapse}
            className="rounded-lg px-3 py-2 text-sm font-medium" style={{ color: FT.textMuted }}>Cancel</button>
        </div>
      )}

      {result && !result.ok && <p className="text-sm" style={{ color: FT.danger }}>{result.message}</p>}
      {result && result.ok && <p className="text-sm" style={{ color: FT.success }}>Workout logged!</p>}
    </form>
  )
}
