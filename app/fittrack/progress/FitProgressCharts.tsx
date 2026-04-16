'use client'

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ExerciseProgressPoint, MacroDay, WeightLog } from '@/lib/fittrack-supabase'

type Props = {
  weightTrend: WeightLog[]
  macroTrend: MacroDay[]
  exerciseNames: string[]
  seriesByName: Record<string, ExerciseProgressPoint[]>
}

export function FitProgressCharts({
  weightTrend,
  macroTrend,
  exerciseNames,
  seriesByName,
}: Props) {
  const [exercise, setExercise] = useState(exerciseNames[0] ?? '')

  const weightData = useMemo(
    () =>
      weightTrend.map((w) => ({
        date: w.date,
        kg: Number(w.weight_kg),
      })),
    [weightTrend]
  )

  const macroData = useMemo(
    () =>
      macroTrend.map((d) => ({
        date: d.date,
        protein: Math.round(d.protein_g),
        calories: Math.round(d.calories),
      })),
    [macroTrend]
  )

  const exData = useMemo(() => {
    if (!exercise) return []
    const pts = seriesByName[exercise] ?? []
    return pts.map((p) => ({
      date: p.date,
      kg: p.max_weight_kg,
      reps: p.max_reps,
    }))
  }, [exercise, seriesByName])

  return (
    <div className="space-y-8">
      <section>
        <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-2">
          Weight
        </p>
        {weightData.length === 0 ? (
          <p className="text-sm text-[#bbb]">No weight entries in this window.</p>
        ) : (
          <div className="h-56 w-full rounded-[10px] border border-[#e8e8e4] bg-white p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e4" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#999" />
                <YAxis tick={{ fontSize: 10 }} stroke="#999" domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="kg" name="kg" stroke="#1d4ed8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section>
        <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-2">
          Macros (14 days)
        </p>
        {macroData.length === 0 ? (
          <p className="text-sm text-[#bbb]">No meal data in this window.</p>
        ) : (
          <div className="h-56 w-full rounded-[10px] border border-[#e8e8e4] bg-white p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={macroData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e4" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#999" />
                <YAxis tick={{ fontSize: 10 }} stroke="#999" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="protein" stroke="#15803d" dot={false} />
                <Line type="monotone" dataKey="calories" stroke="#7c3aed" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section>
        <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-2">
          Exercise load
        </p>
        {exerciseNames.length === 0 ? (
          <p className="text-sm text-[#bbb]">No exercise logs yet. Log a Motra workout first.</p>
        ) : (
          <>
            <select
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="mb-3 w-full max-w-xs rounded-lg border border-[#e8e8e4] bg-white px-3 py-2 text-sm text-[#1a1a1a]"
            >
              {exerciseNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {exData.length === 0 ? (
              <p className="text-sm text-[#bbb]">No data for this exercise.</p>
            ) : (
              <div className="h-56 w-full rounded-[10px] border border-[#e8e8e4] bg-white p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e4" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#999" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#999" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="kg" name="Max kg" stroke="#b45309" dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
