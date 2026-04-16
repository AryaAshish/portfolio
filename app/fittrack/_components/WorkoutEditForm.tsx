'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ExerciseLog, Workout } from '@/lib/fittrack-supabase'
import { updateWorkoutAction, deleteWorkoutAction } from '../workouts/actions'
import { FT, WORKOUT_COLORS } from './tokens'

type TypeChoice = 'push' | 'pull' | 'legs' | 'auxiliary' | 'cardio' | 'rest'
const TYPE_CHOICES: TypeChoice[] = ['push', 'pull', 'legs', 'auxiliary', 'cardio', 'rest']

type SetTypeChoice = 'warmup' | 'working' | 'dropset' | 'cardio'
const SET_TYPES: SetTypeChoice[] = ['warmup', 'working', 'dropset', 'cardio']

type LocalSet = {
  key: string
  id?: string
  exerciseKey: string
  set_number: number | null
  set_type: SetTypeChoice
  reps: number | null
  weight_kg: number | null
  duration_secs: number | null
  deleted: boolean
}

type LocalGroup = {
  key: string
  name: string
  deleted: boolean
}

let localKeyCounter = 0
function nextKey(prefix: string) {
  localKeyCounter += 1
  return `${prefix}-${Date.now()}-${localKeyCounter}`
}

function buildInitialState(logs: ExerciseLog[]): {
  groups: LocalGroup[]
  sets: LocalSet[]
} {
  const groups: LocalGroup[] = []
  const sets: LocalSet[] = []
  const groupByName = new Map<string, LocalGroup>()

  for (const log of logs) {
    let g = groupByName.get(log.exercise_name)
    if (!g) {
      g = { key: nextKey('g'), name: log.exercise_name, deleted: false }
      groupByName.set(log.exercise_name, g)
      groups.push(g)
    }
    sets.push({
      key: nextKey('s'),
      id: log.id,
      exerciseKey: g.key,
      set_number: log.set_number,
      set_type: (log.set_type as SetTypeChoice) ?? 'working',
      reps: log.reps,
      weight_kg: log.weight_kg,
      duration_secs: log.duration_secs,
      deleted: false,
    })
  }

  groups.sort((a, b) => a.name.localeCompare(b.name))
  return { groups, sets }
}

function toNumOrNull(v: string): number | null {
  if (v.trim() === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export function WorkoutEditForm({
  workout,
  logs,
}: {
  workout: Workout
  logs: ExerciseLog[]
}) {
  const router = useRouter()
  const initial = useMemo(() => buildInitialState(logs), [logs])

  const [title, setTitle] = useState(workout.title ?? '')
  const [type, setType] = useState<TypeChoice>(workout.type as TypeChoice)
  const [groups, setGroups] = useState<LocalGroup[]>(initial.groups)
  const [sets, setSets] = useState<LocalSet[]>(initial.sets)
  const [pending, setPending] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const visibleGroups = groups.filter((g) => !g.deleted)

  function addGroup() {
    const g: LocalGroup = { key: nextKey('g'), name: '', deleted: false }
    const s: LocalSet = {
      key: nextKey('s'),
      exerciseKey: g.key,
      set_number: 1,
      set_type: 'working',
      reps: null,
      weight_kg: null,
      duration_secs: null,
      deleted: false,
    }
    setGroups((prev) => [...prev, g])
    setSets((prev) => [...prev, s])
  }

  function removeGroup(key: string) {
    setGroups((prev) =>
      prev.map((g) => (g.key === key ? { ...g, deleted: true } : g))
    )
    setSets((prev) =>
      prev.map((s) => (s.exerciseKey === key ? { ...s, deleted: true } : s))
    )
  }

  function renameGroup(key: string, name: string) {
    setGroups((prev) =>
      prev.map((g) => (g.key === key ? { ...g, name } : g))
    )
  }

  function addSet(groupKey: string) {
    const groupSets = sets.filter((s) => s.exerciseKey === groupKey && !s.deleted)
    const nextNum =
      groupSets.reduce((max, s) => Math.max(max, s.set_number ?? 0), 0) + 1
    const s: LocalSet = {
      key: nextKey('s'),
      exerciseKey: groupKey,
      set_number: nextNum,
      set_type: 'working',
      reps: null,
      weight_kg: null,
      duration_secs: null,
      deleted: false,
    }
    setSets((prev) => [...prev, s])
  }

  function removeSet(key: string) {
    setSets((prev) =>
      prev.map((s) => (s.key === key ? { ...s, deleted: true } : s))
    )
  }

  function updateSet(key: string, patch: Partial<LocalSet>) {
    setSets((prev) => prev.map((s) => (s.key === key ? { ...s, ...patch } : s)))
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const groupMap = new Map(groups.map((g) => [g.key, g]))

    const payloadSets = sets
      .filter((s) => {
        if (s.deleted && !s.id) return false
        return true
      })
      .map((s) => {
        const g = groupMap.get(s.exerciseKey)
        return {
          id: s.id,
          exercise_name: g?.name?.trim() ?? '',
          set_number: s.set_number,
          set_type: s.set_type,
          reps: s.reps,
          weight_kg: s.weight_kg,
          duration_secs: s.duration_secs,
          delete: s.deleted,
        }
      })
      .filter((s) => s.delete || s.exercise_name.length > 0)

    const r = await updateWorkoutAction(workout.id, {
      title: title.trim() || null,
      type,
      sets: payloadSets,
    })
    setPending(false)
    if (r.ok) {
      router.back()
      router.refresh()
    } else {
      setError(r.message)
    }
  }

  async function onDelete() {
    if (!confirm('Delete this workout and all its sets? This cannot be undone.')) return
    setDeleting(true)
    await deleteWorkoutAction(workout.id)
  }

  return (
    <form onSubmit={onSave} className="space-y-5">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: FT.textMuted }}>
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Workout title"
          className="w-full rounded-xl border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
          disabled={pending || deleting}
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: FT.textMuted }}>
          Day type
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_CHOICES.map((choice) => {
            const isActive = type === choice
            const wc = WORKOUT_COLORS[choice]
            return (
              <button
                key={choice}
                type="button"
                onClick={() => setType(choice)}
                disabled={pending || deleting}
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all"
                style={{
                  background: isActive ? wc.text : wc.bg,
                  color: isActive ? '#fff' : wc.text,
                  border: `1.5px solid ${wc.text}`,
                }}
              >
                {wc.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: FT.textMuted }}>
          Exercises
        </p>

        {visibleGroups.length === 0 && (
          <p className="text-xs py-3 text-center" style={{ color: FT.textMuted }}>
            No exercises yet. Add one below.
          </p>
        )}

        {visibleGroups.map((g) => {
          const groupSets = sets.filter((s) => s.exerciseKey === g.key && !s.deleted)
          return (
            <div
              key={g.key}
              className="rounded-xl p-3 space-y-2"
              style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={g.name}
                  onChange={(e) => renameGroup(g.key, e.target.value)}
                  placeholder="Exercise name"
                  className="flex-1 rounded-lg border px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200"
                  style={{ borderColor: FT.border, color: FT.textPrimary }}
                  disabled={pending || deleting}
                />
                <button
                  type="button"
                  onClick={() => removeGroup(g.key)}
                  disabled={pending || deleting}
                  className="text-xs px-2"
                  style={{ color: FT.danger }}
                >
                  Remove
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="grid grid-cols-[24px_1fr_1fr_1fr_24px] gap-1.5 text-[10px] font-semibold uppercase tracking-wide px-1" style={{ color: FT.textMuted }}>
                  <span>#</span>
                  <span>Type</span>
                  <span>Reps</span>
                  <span>Kg</span>
                  <span></span>
                </div>
                {groupSets.map((s) => (
                  <div key={s.key} className="grid grid-cols-[24px_1fr_1fr_1fr_24px] gap-1.5 items-center">
                    <input
                      type="number"
                      value={s.set_number ?? ''}
                      onChange={(e) => updateSet(s.key, { set_number: toNumOrNull(e.target.value) })}
                      className="rounded border px-1 py-1 text-xs text-center focus:outline-none focus:ring-1"
                      style={{ borderColor: FT.border, color: FT.textPrimary }}
                      disabled={pending || deleting}
                    />
                    <select
                      value={s.set_type}
                      onChange={(e) => updateSet(s.key, { set_type: e.target.value as SetTypeChoice })}
                      className="rounded border px-1 py-1 text-xs focus:outline-none focus:ring-1"
                      style={{ borderColor: FT.border, color: FT.textPrimary, background: FT.surface }}
                      disabled={pending || deleting}
                    >
                      {SET_TYPES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={s.reps ?? ''}
                      onChange={(e) => updateSet(s.key, { reps: toNumOrNull(e.target.value) })}
                      className="rounded border px-1 py-1 text-xs text-center focus:outline-none focus:ring-1"
                      style={{ borderColor: FT.border, color: FT.textPrimary }}
                      disabled={pending || deleting}
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={s.weight_kg ?? ''}
                      onChange={(e) => updateSet(s.key, { weight_kg: toNumOrNull(e.target.value) })}
                      className="rounded border px-1 py-1 text-xs text-center focus:outline-none focus:ring-1"
                      style={{ borderColor: FT.border, color: FT.textPrimary }}
                      disabled={pending || deleting}
                    />
                    <button
                      type="button"
                      onClick={() => removeSet(s.key)}
                      disabled={pending || deleting}
                      className="text-base leading-none"
                      style={{ color: FT.textMuted }}
                      aria-label="Delete set"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSet(g.key)}
                  disabled={pending || deleting}
                  className="text-xs font-semibold mt-1"
                  style={{ color: FT.accent }}
                >
                  + Add set
                </button>
              </div>
            </div>
          )
        })}

        <button
          type="button"
          onClick={addGroup}
          disabled={pending || deleting}
          className="w-full rounded-xl border-2 border-dashed py-2.5 text-sm font-semibold"
          style={{ borderColor: FT.border, color: FT.textSecondary }}
        >
          + Add exercise
        </button>
      </div>

      {error && (
        <p className="text-sm" style={{ color: FT.danger }}>{error}</p>
      )}

      <div className="flex gap-2 pt-2" style={{ borderTop: `1px solid ${FT.border}` }}>
        <button
          type="submit"
          disabled={pending || deleting}
          className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: FT.accent }}
        >
          {pending ? 'Saving...' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={pending || deleting}
          className="rounded-lg px-3 py-2.5 text-sm font-medium"
          style={{ color: FT.textMuted }}
        >
          Cancel
        </button>
      </div>

      <div className="pt-4" style={{ borderTop: `1px solid ${FT.border}` }}>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending || deleting}
          className="w-full rounded-lg px-3 py-2 text-xs font-semibold"
          style={{ color: FT.danger, border: `1px solid ${FT.danger}`, background: FT.dangerBg }}
        >
          {deleting ? 'Deleting...' : 'Delete workout'}
        </button>
      </div>
    </form>
  )
}
