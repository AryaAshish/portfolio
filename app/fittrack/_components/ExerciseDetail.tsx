'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ExerciseProgressPoint, ExerciseSession } from '@/lib/fittrack-supabase'
import { FT } from './tokens'

type Set = ExerciseSession['sets'][0]

function formatSetLabel(s: Set): string {
  if (s.duration_secs != null) {
    const m = Math.floor(s.duration_secs / 60)
    const sec = s.duration_secs % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }
  const prefix = s.set_type === 'warmup' ? 'W' : s.set_type === 'dropset' ? 'D' : ''
  const body = `${s.reps ?? 0} × ${s.weight_kg ?? 0}kg`
  return prefix ? `${prefix} ${body}` : body
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function sessionMaxWeight(s: ExerciseSession): number {
  let max = 0
  for (const set of s.sets) {
    if ((set.weight_kg ?? 0) > max) max = set.weight_kg ?? 0
  }
  return max
}

function sessionTotalReps(s: ExerciseSession): number {
  return s.sets.reduce((acc, set) => acc + (set.reps ?? 0), 0)
}

function SetBar({ set, maxWeight }: { set: Set; maxWeight: number }) {
  const w = set.weight_kg ?? 0
  const pct = maxWeight > 0 ? Math.max(8, (w / maxWeight) * 100) : 8
  const isWarmup = set.set_type === 'warmup'
  const isDrop = set.set_type === 'dropset'
  const color = isWarmup ? FT.textMuted : isDrop ? FT.warning : FT.accent

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className="flex-shrink-0 w-5 text-right font-semibold"
        style={{ color: FT.textMuted }}
      >
        {set.set_number ?? (isWarmup ? 'W' : isDrop ? 'D' : '•')}
      </span>
      <div className="flex-1 h-5 rounded" style={{ background: FT.borderSubtle }}>
        <div
          className="h-full rounded flex items-center px-1.5"
          style={{ width: `${pct}%`, background: color, minWidth: 32 }}
        >
          <span className="text-[10px] font-semibold text-white whitespace-nowrap">
            {formatSetLabel(set)}
          </span>
        </div>
      </div>
    </div>
  )
}

function SingleSessionView({ session }: { session: ExerciseSession }) {
  const max = sessionMaxWeight(session)
  const totalReps = sessionTotalReps(session)
  const workingSets = session.sets.filter((s) => s.set_type === 'working').length

  return (
    <div
      className="rounded-xl p-3 space-y-3"
      style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
    >
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: FT.textMuted }}>
          {formatDate(session.date)}
        </p>
        <div className="flex gap-3 text-[11px]" style={{ color: FT.textMuted }}>
          {max > 0 && <span><span className="font-semibold" style={{ color: FT.textPrimary }}>{max}kg</span> max</span>}
          {workingSets > 0 && <span><span className="font-semibold" style={{ color: FT.textPrimary }}>{workingSets}</span> sets</span>}
          {totalReps > 0 && <span><span className="font-semibold" style={{ color: FT.textPrimary }}>{totalReps}</span> reps</span>}
        </div>
      </div>
      <div className="space-y-1.5">
        {session.sets.map((set, i) => (
          <SetBar key={i} set={set} maxWeight={max} />
        ))}
      </div>
    </div>
  )
}

function SessionRow({ session }: { session: ExerciseSession }) {
  const max = sessionMaxWeight(session)
  const working = session.sets.filter((s) => s.set_type === 'working')
  return (
    <div
      className="rounded-lg p-2.5"
      style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
    >
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-semibold" style={{ color: FT.textSecondary }}>
          {formatDate(session.date)}
        </span>
        {max > 0 && (
          <span className="text-xs font-semibold" style={{ color: FT.textPrimary }}>
            {max}kg max
          </span>
        )}
      </div>
      <p className="text-[11px]" style={{ color: FT.textMuted }}>
        {(working.length > 0 ? working : session.sets).map(formatSetLabel).join(' · ')}
      </p>
    </div>
  )
}

export function ExerciseDetail({
  name,
  progression,
  sessions,
}: {
  name: string
  progression: ExerciseProgressPoint[]
  sessions: ExerciseSession[]
}) {
  const chartData = progression.map((p) => ({
    date: p.date.slice(5),
    kg: p.max_weight_kg,
    reps: p.max_reps,
  }))

  if (sessions.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-base font-semibold" style={{ color: FT.textPrimary }}>{name}</h2>
        <div
          className="rounded-xl p-6 text-center space-y-2"
          style={{ background: FT.surface, border: `1px dashed ${FT.border}` }}
        >
          <p className="text-sm font-medium" style={{ color: FT.textSecondary }}>
            No data yet
          </p>
          <p className="text-xs" style={{ color: FT.textMuted }}>
            Paste a Motra session from the Today screen that includes {name}. Your progression will appear here.
          </p>
        </div>
      </div>
    )
  }

  if (sessions.length === 1) {
    return (
      <div className="space-y-4">
        <h2 className="text-base font-semibold" style={{ color: FT.textPrimary }}>{name}</h2>
        <SingleSessionView session={sessions[0]} />
        <p className="text-xs text-center" style={{ color: FT.textMuted }}>
          Log another session to unlock your progression trend.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold" style={{ color: FT.textPrimary }}>{name}</h2>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
          Max Weight Trend
        </p>
        <div
          className="rounded-xl p-2"
          style={{ background: FT.surface, border: `1px solid ${FT.border}`, height: 200 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={FT.borderSubtle} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke={FT.textMuted} />
              <YAxis tick={{ fontSize: 10 }} stroke={FT.textMuted} domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="kg" name="Max kg" stroke={FT.accent} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
          Session History
        </p>
        <div className="space-y-1.5">
          {sessions.map((s) => (
            <SessionRow key={s.date} session={s} />
          ))}
        </div>
      </div>
    </div>
  )
}
