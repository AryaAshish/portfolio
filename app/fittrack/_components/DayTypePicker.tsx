'use client'

import { useState } from 'react'
import type { SuggestedExercise } from '@/lib/fittrack-supabase'
import { FT, WORKOUT_COLORS } from './tokens'

const TYPES = ['push', 'pull', 'legs', 'auxiliary', 'cardio'] as const

export function DayTypePicker({
  inferredType,
  exercisesByType,
}: {
  inferredType: string
  exercisesByType: Record<string, SuggestedExercise[]>
}) {
  const [selected, setSelected] = useState(inferredType)
  const exercises = exercisesByType[selected] ?? []

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
          What&apos;s today?
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((type) => {
            const wc = WORKOUT_COLORS[type]
            const isActive = selected === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelected(type)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all"
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

      <div
        className="rounded-xl p-3"
        style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
      >
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: FT.textMuted }}>
            Suggested Exercises
          </p>
          {exercises.length > 0 && (
            <span className="text-[10px]" style={{ color: FT.textMuted }}>
              last used
            </span>
          )}
        </div>
        {exercises.length > 0 ? (
          <div className="space-y-1.5">
            {exercises.map((ex) => (
              <div key={ex.name} className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium truncate" style={{ color: FT.textPrimary }}>
                  {ex.name}
                </span>
                <span className="text-[11px] flex-shrink-0 font-medium" style={{ color: FT.textSecondary }}>
                  {ex.lastMaxWeight != null && ex.lastMaxWeight > 0
                    ? `${ex.lastMaxWeight}kg`
                    : '\u2014'}
                  {ex.lastMaxReps != null && ex.lastMaxReps > 0 && ` \u00d7 ${ex.lastMaxReps}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs py-2" style={{ color: FT.textMuted }}>
            No history yet. Log your first {WORKOUT_COLORS[selected]?.label.toLowerCase() ?? selected} workout to see suggestions here.
          </p>
        )}
      </div>
    </div>
  )
}
