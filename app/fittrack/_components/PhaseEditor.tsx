'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PlanPhaseRow } from '@/lib/fittrack-supabase'
import { validatePhases } from '@/lib/fittrack/plan-helpers'
import { resetPhasesAction, savePhasesAction } from '../plan/actions'
import { FT } from './tokens'

type Draft = {
  phase_number: number
  name: string
  start_date: string
  end_date: string
  focus: string | null
}

const SWATCHES = [
  { bg: '#dbeafe', fg: '#1d4ed8' },
  { bg: '#dcfce7', fg: '#15803d' },
  { bg: '#fef3c7', fg: '#b45309' },
  { bg: '#f3e8ff', fg: '#7c3aed' },
  { bg: '#ffe4e6', fg: '#be123c' },
  { bg: '#e0e7ff', fg: '#4338ca' },
]

function toDraft(p: PlanPhaseRow): Draft {
  return {
    phase_number: p.phase_number,
    name: p.name,
    start_date: p.start_date,
    end_date: p.end_date,
    focus: p.focus,
  }
}

export function PhaseEditor({ initial }: { initial: PlanPhaseRow[] }) {
  const router = useRouter()
  const [drafts, setDrafts] = useState<Draft[]>(() => initial.map(toDraft))
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)

  const validationErrors = useMemo(() => validatePhases(drafts), [drafts])

  function updateRow(idx: number, patch: Partial<Draft>) {
    setDrafts((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)))
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    setDrafts((prev) => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next.map((d, i) => ({ ...d, phase_number: i + 1 }))
    })
  }

  function moveDown(idx: number) {
    setDrafts((prev) => {
      if (idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next.map((d, i) => ({ ...d, phase_number: i + 1 }))
    })
  }

  function deleteRow(idx: number) {
    setDrafts((prev) => prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, phase_number: i + 1 })))
  }

  function addRow() {
    setDrafts((prev) => {
      const last = prev[prev.length - 1]
      const start = last ? addDays(last.end_date, 1) : '2026-04-14'
      const end = addDays(start, 27)
      return [
        ...prev,
        {
          phase_number: prev.length + 1,
          name: `Phase ${prev.length + 1}`,
          start_date: start,
          end_date: end,
          focus: null,
        },
      ]
    })
  }

  async function handleSave() {
    setError(null)
    if (validationErrors.length > 0) {
      setError(validationErrors[0].message)
      return
    }
    setPending(true)
    const res = await savePhasesAction(drafts)
    setPending(false)
    if (res.ok) {
      router.refresh()
    } else {
      setError(res.message)
    }
  }

  async function handleReset() {
    setPending(true)
    setError(null)
    const res = await resetPhasesAction()
    setPending(false)
    if (res.ok) {
      setConfirmingReset(false)
      router.refresh()
    } else {
      setError(res.message)
    }
  }

  function errorFor(idx: number): string | undefined {
    return validationErrors.find((e) => e.index === idx)?.message
  }

  return (
    <div className="space-y-4">
      <PhasePreviewStrip drafts={drafts} />

      <div className="space-y-3">
        {drafts.map((d, idx) => {
          const swatch = SWATCHES[idx % SWATCHES.length]
          const rowErr = errorFor(idx)
          return (
            <div
              key={idx}
              className="rounded-xl p-3 space-y-2"
              style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap"
                  style={{ background: swatch.bg, color: swatch.fg }}
                >
                  Phase {d.phase_number}
                </span>
                <input
                  value={d.name}
                  onChange={(e) => updateRow(idx, { name: e.target.value })}
                  placeholder="Phase name"
                  className="rounded-lg border px-2 py-1.5 text-sm font-semibold flex-1 min-w-0"
                  style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
                />
              </div>
              <div className="flex gap-1 justify-end">
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0 || pending}
                  className="rounded px-2 py-1 text-xs disabled:opacity-30"
                  style={{ background: FT.canvas, color: FT.textSecondary }}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(idx)}
                  disabled={idx === drafts.length - 1 || pending}
                  className="rounded px-2 py-1 text-xs disabled:opacity-30"
                  style={{ background: FT.canvas, color: FT.textSecondary }}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => deleteRow(idx)}
                  disabled={pending || drafts.length <= 1}
                  className="rounded px-2 py-1 text-xs disabled:opacity-30"
                  style={{ background: FT.dangerBg, color: FT.danger }}
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: FT.textMuted }}>
                    Start
                  </span>
                  <input
                    type="date"
                    value={d.start_date}
                    onChange={(e) => updateRow(idx, { start_date: e.target.value })}
                    className="rounded-lg border px-2 py-1.5 text-xs w-full"
                    style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
                  />
                </label>
                <label className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: FT.textMuted }}>
                    End
                  </span>
                  <input
                    type="date"
                    value={d.end_date}
                    onChange={(e) => updateRow(idx, { end_date: e.target.value })}
                    className="rounded-lg border px-2 py-1.5 text-xs w-full"
                    style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
                  />
                </label>
              </div>

              <textarea
                value={d.focus ?? ''}
                onChange={(e) => updateRow(idx, { focus: e.target.value })}
                placeholder="Focus (optional)"
                rows={2}
                className="w-full rounded-lg border px-2 py-1.5 text-xs resize-none"
                style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
              />

              {rowErr && (
                <p className="text-[11px] font-medium" style={{ color: FT.warning }}>
                  {rowErr}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={addRow}
        disabled={pending}
        className="w-full rounded-lg px-3 py-2 text-xs font-semibold border-2 border-dashed"
        style={{ borderColor: FT.border, color: FT.textSecondary, background: FT.canvas }}
      >
        + Add phase
      </button>

      {error && (
        <p className="text-xs" style={{ color: FT.danger }}>
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending || drafts.length === 0}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: FT.accent }}
        >
          {pending ? 'Saving...' : 'Save changes'}
        </button>

        {confirmingReset ? (
          <>
            <button
              type="button"
              onClick={handleReset}
              disabled={pending}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
              style={{ background: FT.danger }}
            >
              Confirm reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmingReset(false)}
              disabled={pending}
              className="rounded-lg px-3 py-2 text-sm font-medium"
              style={{ color: FT.textMuted }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingReset(true)}
            disabled={pending}
            className="rounded-lg px-3 py-2 text-sm font-medium"
            style={{ background: FT.surface, color: FT.textPrimary, border: `1px solid ${FT.border}` }}
          >
            Reset to defaults
          </button>
        )}
      </div>
    </div>
  )
}

function PhasePreviewStrip({ drafts }: { drafts: Draft[] }) {
  if (drafts.length === 0) return null
  const segments = drafts.map((d, i) => {
    const days = dayDiff(d.start_date, d.end_date) + 1
    return { days: Math.max(days, 1), swatch: SWATCHES[i % SWATCHES.length], label: d.name }
  })
  const total = segments.reduce((s, seg) => s + seg.days, 0)
  return (
    <div className="space-y-2">
      <div
        className="flex rounded-full overflow-hidden"
        style={{ border: `1px solid ${FT.border}`, height: 12 }}
      >
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              width: `${(seg.days / total) * 100}%`,
              background: seg.swatch.bg,
            }}
            title={`${seg.label} (${seg.days}d)`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px]" style={{ color: FT.textSecondary }}>
        {segments.map((seg, i) => (
          <span key={i} className="inline-flex items-center gap-1">
            <span
              className="inline-block rounded-sm"
              style={{ width: 8, height: 8, background: seg.swatch.bg, border: `1px solid ${seg.swatch.fg}` }}
            />
            {seg.label} · {seg.days}d
          </span>
        ))}
      </div>
    </div>
  )
}

function addDays(iso: string, n: number): string {
  const y = Number(iso.slice(0, 4))
  const m = Number(iso.slice(5, 7)) - 1
  const d = Number(iso.slice(8, 10))
  const t = Date.UTC(y, m, d) + n * 86_400_000
  const dt = new Date(t)
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(dt.getUTCDate()).padStart(2, '0')
  return `${dt.getUTCFullYear()}-${mm}-${dd}`
}

function dayDiff(a: string, b: string): number {
  const t1 = Date.UTC(Number(a.slice(0, 4)), Number(a.slice(5, 7)) - 1, Number(a.slice(8, 10)))
  const t2 = Date.UTC(Number(b.slice(0, 4)), Number(b.slice(5, 7)) - 1, Number(b.slice(8, 10)))
  return Math.floor((t2 - t1) / 86_400_000)
}
