import type { Metadata } from 'next'
import {
  getUserProfile,
  getTodayMacros,
  getMealsForDate,
  getMealTemplates,
  getFoodLibrary,
  getWeightTrend,
  getLatestWeight,
  getHealthMarkers,
} from '@/lib/fittrack-supabase'
import { todayISO } from '@/fittrack/plan-config'
import { FT } from '../_components/tokens'
import { OverviewProgressBar } from '../_components/OverviewProgressBar'
import { MealForm } from '../_components/MealForm'
import { MealList } from '../_components/MealList'
import { WeightChart } from '../_components/WeightChart'
import { WeightLogForm } from '../_components/WeightLogForm'
import { BodyDateNav } from '../_components/BodyDateNav'
import { WeeklyTargetEditor } from '../_components/WeeklyTargetEditor'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Body' }

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  critical: { bg: FT.dangerBg, text: FT.danger },
  high:     { bg: FT.warningBg, text: FT.warning },
  low:      { bg: FT.warningBg, text: FT.warning },
  borderline: { bg: '#fffbeb', text: '#92400e' },
  normal:   { bg: FT.successBg, text: FT.success },
}

export default async function BodyPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const today = todayISO()
  const selectedDate = searchParams.date || today
  const isToday = selectedDate === today

  const [profile, macros, meals, templates, foods, weightData, latestWeight, markers] =
    await Promise.all([
      getUserProfile(),
      getTodayMacros(selectedDate),
      getMealsForDate(selectedDate),
      getMealTemplates(),
      getFoodLibrary(),
      getWeightTrend(90),
      getLatestWeight(),
      getHealthMarkers(),
    ])

  const proteinTarget = profile?.daily_protein_target ?? 145
  const calorieTarget = profile?.daily_calorie_target ?? 1900
  const weightTarget = profile?.target_weight_kg ?? 72

  const flagged = markers.filter(
    (m) => m.status === 'critical' || m.status === 'high' || m.status === 'low'
  )
  const allMarkers = markers

  const dateLabel = isToday
    ? "Today\u2019s Macros"
    : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div className="space-y-5">
      {/* Date Navigation */}
      <BodyDateNav date={selectedDate} today={today} />

      {/* Macro Progress */}
      <div
        className="rounded-xl p-3"
        style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: FT.textMuted }}>
          {dateLabel}
        </p>
        <div className="space-y-3">
          <MacroRow label="Protein" value={macros.protein_g} target={proteinTarget} color={FT.accent} unit="g" />
          <MacroRow label="Calories" value={macros.calories} target={calorieTarget} color="#7c3aed" />
          <MacroRow label="Carbs" value={macros.carbs_g} target={null} color="#d97706" unit="g" />
          <MacroRow label="Fat" value={macros.fat_g} target={null} color="#be123c" unit="g" />
        </div>
      </div>

      {/* Meal Log */}
      <div
        className="rounded-xl p-3"
        style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
          Log a Meal
        </p>
        <MealForm date={selectedDate} templates={templates} foods={foods} />
      </div>

      {/* Meals for selected date */}
      <MealList meals={meals} isToday={isToday} />

      {/* Weekly Gym Target */}
      <WeeklyTargetEditor current={profile?.weekly_gym_target ?? 3} />

      {/* Log Weight */}
      <div
        className="rounded-xl p-3"
        style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
          Log Weight
        </p>
        <WeightLogForm date={selectedDate} latestKg={latestWeight?.weight_kg ?? null} />
      </div>

      {/* Weight Trend */}
      <div
        className="rounded-xl p-3"
        style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
          Weight Trend
        </p>
        <WeightChart
          data={weightData}
          targetKg={weightTarget}
          latestKg={latestWeight?.weight_kg ?? null}
        />
      </div>

      {/* Health Markers — Flagged */}
      {flagged.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
            Attention
          </p>
          <div className="space-y-1.5">
            {flagged.map((m) => {
              const sc = STATUS_COLORS[m.status ?? 'normal'] ?? STATUS_COLORS.normal
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5"
                  style={{ background: sc.bg, border: `1px solid ${sc.text}20` }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: FT.textPrimary }}>{m.marker_name}</p>
                    <p className="text-[10px]" style={{ color: FT.textMuted }}>{m.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: sc.text }}>
                      {m.value} {m.unit}
                    </p>
                    <p className="text-[10px] uppercase font-semibold" style={{ color: sc.text }}>
                      {m.status}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All Health Markers */}
      {allMarkers.length > 0 && (
        <details>
          <summary
            className="text-xs font-semibold uppercase tracking-wide cursor-pointer"
            style={{ color: FT.textMuted }}
          >
            All Health Markers ({allMarkers.length})
          </summary>
          <div className="mt-2 space-y-1">
            {allMarkers.map((m) => {
              const sc = STATUS_COLORS[m.status ?? 'normal'] ?? STATUS_COLORS.normal
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
                >
                  <div>
                    <p className="text-xs font-medium" style={{ color: FT.textPrimary }}>{m.marker_name}</p>
                    <p className="text-[10px]" style={{ color: FT.textMuted }}>{m.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold" style={{ color: sc.text }}>
                      {m.value} {m.unit}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </details>
      )}
    </div>
  )
}

function MacroRow({
  label,
  value,
  target,
  color,
  unit,
}: {
  label: string
  value: number
  target: number | null
  color: string
  unit?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-0.5">
        <span style={{ color: FT.textSecondary }}>{label}</span>
        <span className="font-semibold" style={{ color: FT.textPrimary }}>
          {Math.round(value)}
          {unit && unit}
          {target != null && (
            <span className="font-normal" style={{ color: FT.textMuted }}>
              {' '}/ {target}{unit && unit}
            </span>
          )}
        </span>
      </div>
      {target != null && (
        <OverviewProgressBar value={value} max={target} color={color} />
      )}
    </div>
  )
}
