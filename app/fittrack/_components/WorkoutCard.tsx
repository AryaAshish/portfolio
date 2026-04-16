import Link from 'next/link'
import type { ExerciseComparison, ExerciseLog, Workout } from '@/lib/fittrack-supabase'
import { FT, workoutColor } from './tokens'

type SetGroup = {
  name: string
  sets: ExerciseLog[]
}

function groupByExercise(logs: ExerciseLog[]): SetGroup[] {
  const groups: SetGroup[] = []
  const seen = new Map<string, SetGroup>()
  for (const log of logs) {
    let g = seen.get(log.exercise_name)
    if (!g) {
      g = { name: log.exercise_name, sets: [] }
      seen.set(log.exercise_name, g)
      groups.push(g)
    }
    g.sets.push(log)
  }
  return groups
}

function parseNamesFromTitle(title: string): string[] {
  const parts = title.split(',').map((p) => p.trim()).filter(Boolean)
  const seen = new Set<string>()
  const names: string[] = []
  for (const raw of parts) {
    const cleaned = raw
      .replace(/\s+\d+(\.\d+)?\s*kg.*$/i, '')
      .replace(/\s+assist(ed)?$/i, '')
      .replace(/\s+warmup$/i, '')
      .trim()
    if (cleaned.length > 2 && !seen.has(cleaned)) {
      seen.add(cleaned)
      names.push(cleaned)
    }
  }
  return names
}

function formatSet(s: ExerciseLog): string {
  if (s.duration_secs != null) {
    const m = Math.floor(s.duration_secs / 60)
    const sec = s.duration_secs % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }
  const prefix = s.set_type === 'warmup' ? 'W ' : s.set_type === 'dropset' ? 'D ' : ''
  return `${prefix}${s.reps ?? 0}x${s.weight_kg ?? 0}kg`
}

function formatVolume(kg: number | null): string | null {
  if (kg == null) return null
  const n = Number(kg)
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K kg` : `${Math.round(n)} kg`
}

function ComparisonBadge({ comp }: { comp: ExerciseComparison }) {
  if (comp.deltaPercent == null || comp.prevMaxWeight == null) return null
  const delta = comp.deltaPercent
  if (delta === 0) {
    return <span className="text-[10px] font-medium" style={{ color: FT.textMuted }}>same</span>
  }
  const up = delta > 0
  return (
    <span
      className="text-[10px] font-semibold"
      style={{ color: up ? FT.success : FT.warning }}
    >
      {up ? '+' : ''}{delta}%
    </span>
  )
}

export function WorkoutCard({
  workout,
  exerciseLogs,
  comparisons,
  linkableExercises = false,
  editable = false,
}: {
  workout: Workout
  exerciseLogs: ExerciseLog[]
  comparisons?: ExerciseComparison[]
  linkableExercises?: boolean
  editable?: boolean
}) {
  const wc = workoutColor(workout.type)
  const title = workout.title || workout.notes || 'Workout'
  const vol = formatVolume(workout.volume_kg)
  const groups = groupByExercise(exerciseLogs)
  const compMap = new Map(
    (comparisons ?? []).map((c) => [c.exerciseName, c])
  )

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${FT.border}`, background: FT.surface }}
    >
      <div className="flex">
        <div className="w-1 flex-shrink-0" style={{ background: wc.text }} />
        <div className="flex-1 p-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: FT.textPrimary }}>
              {title}
            </p>
            <span
              className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: wc.bg, color: wc.text }}
            >
              {wc.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs mb-2" style={{ color: FT.textMuted }}>
            {workout.duration_mins != null && <span>{workout.duration_mins} min</span>}
            {vol && <span>{vol}</span>}
            {workout.calories_burned != null && <span>{workout.calories_burned} cal</span>}
            {editable && (
              <Link
                href={`/fittrack/train/${workout.id}/edit`}
                className="ml-auto text-xs font-medium underline-offset-2 hover:underline"
                style={{ color: FT.accent }}
              >
                Edit
              </Link>
            )}
          </div>

          {groups.length > 0 ? (
            <div className="space-y-1.5 pt-1" style={{ borderTop: `1px solid ${FT.borderSubtle}` }}>
              {groups.map((g) => {
                const comp = compMap.get(g.name)
                const nameEl = linkableExercises ? (
                  <Link
                    href={`/fittrack/train?exercise=${encodeURIComponent(g.name)}`}
                    className="text-xs font-semibold underline-offset-2 hover:underline"
                    style={{ color: FT.accent }}
                  >
                    {g.name} →
                  </Link>
                ) : (
                  <p className="text-xs font-semibold" style={{ color: FT.textSecondary }}>
                    {g.name}
                  </p>
                )

                return (
                  <div key={g.name} className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {nameEl}
                      <p className="text-xs truncate" style={{ color: FT.textMuted }}>
                        {g.sets.map(formatSet).join(' · ')}
                      </p>
                    </div>
                    {comp && <ComparisonBadge comp={comp} />}
                  </div>
                )
              })}
            </div>
          ) : (() => {
            const fallbackNames = workout.title ? parseNamesFromTitle(workout.title) : []
            if (fallbackNames.length < 2) return null
            return (
              <div className="space-y-1 pt-1" style={{ borderTop: `1px solid ${FT.borderSubtle}` }}>
                <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: FT.textMuted }}>
                  Name only · no sets logged
                </p>
                <div className="flex flex-wrap gap-1">
                  {fallbackNames.map((name) => {
                    const el = linkableExercises ? (
                      <Link
                        key={name}
                        href={`/fittrack/train?exercise=${encodeURIComponent(name)}`}
                        className="text-[11px] px-2 py-0.5 rounded-full underline-offset-2 hover:underline"
                        style={{ background: FT.borderSubtle, color: FT.textSecondary }}
                      >
                        {name}
                      </Link>
                    ) : (
                      <span
                        key={name}
                        className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: FT.borderSubtle, color: FT.textSecondary }}
                      >
                        {name}
                      </span>
                    )
                    return el
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
