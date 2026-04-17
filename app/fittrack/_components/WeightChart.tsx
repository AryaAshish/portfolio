'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { WeightLog } from '@/lib/fittrack-supabase'
import { FT } from './tokens'

export function WeightChart({
  data,
  targetKg,
  latestKg,
}: {
  data: WeightLog[]
  targetKg: number
  latestKg: number | null
}) {
  const chartData = data.map((w) => ({
    date: w.date.slice(5),
    kg: w.weight_kg,
  }))

  const weekAgo = data.length > 0
    ? data.filter((w) => {
        const diff = Math.abs(Date.now() - new Date(w.date + 'T00:00:00').getTime())
        return diff >= 5 * 86_400_000 && diff <= 9 * 86_400_000
      })[0]
    : null

  const weekDelta =
    weekAgo && latestKg != null
      ? (latestKg - weekAgo.weight_kg).toFixed(1)
      : null

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <span className="text-2xl font-bold" style={{ color: FT.textPrimary }}>
            {latestKg != null ? `${latestKg} kg` : '—'}
          </span>
          {weekDelta && (
            <span
              className="ml-2 text-xs font-medium"
              style={{ color: Number(weekDelta) <= 0 ? FT.success : FT.warning }}
            >
              {Number(weekDelta) > 0 ? '+' : ''}{weekDelta} kg this week
            </span>
          )}
        </div>
        <span className="text-[10px]" style={{ color: FT.textMuted }}>
          target: {targetKg} kg
        </span>
      </div>

      {chartData.length > 1 ? (
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={FT.borderSubtle} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke={FT.textMuted} />
              <YAxis tick={{ fontSize: 10 }} stroke={FT.textMuted} domain={['auto', 'auto']} />
              <Tooltip />
              <ReferenceLine
                y={targetKg}
                stroke={FT.success}
                strokeDasharray="6 3"
                strokeWidth={1.5}
              />
              <Line
                type="monotone"
                dataKey="kg"
                name="Weight"
                stroke={FT.accent}
                strokeWidth={2}
                dot={{ r: 2.5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-xs" style={{ color: FT.textMuted }}>Need at least 2 entries to show trend.</p>
      )}
    </div>
  )
}
