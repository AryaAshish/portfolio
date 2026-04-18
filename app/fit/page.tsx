import type { Metadata } from 'next'
import Link from 'next/link'
import { createFitPublicServerClient } from '@/lib/fit-public/client-server'
import {
  getUserProfile,
  getTodayMacros,
  getWorkoutForDate,
  getWeeklyGymStreak,
  getPlanPhases,
} from '@/lib/fit-public/data'
import { todayISO } from '@/fittrack/plan-config'
import {
  getCurrentPhase,
  getPlanDayNumber,
  getPlanStartISO,
  getPlanTotalDays,
} from '@/lib/fittrack/plan-helpers'
import { FT, phaseSwatch, workoutColor } from '@/app/fittrack/_components/tokens'
import { OverviewProgressBar } from '@/app/fittrack/_components/OverviewProgressBar'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'FitTrack' }

export default async function FitOverviewPage() {
  const today = todayISO()
  const client = createFitPublicServerClient()

  const [profile, todayMacros, todayWorkout, streak, planPhases] = await Promise.all([
    getUserProfile(client),
    getTodayMacros(client, today),
    getWorkoutForDate(client, today),
    getWeeklyGymStreak(client),
    getPlanPhases(client),
  ])

  const activePhase = getCurrentPhase(today, planPhases)
  const planStartISO = getPlanStartISO(planPhases)
  const totalPlanDays = getPlanTotalDays(planPhases)
  const dayNum = planStartISO ? getPlanDayNumber(today, planStartISO) : 1
  const swatch = activePhase ? phaseSwatch(activePhase.phase_number) : phaseSwatch(1)

  const proteinTarget = profile?.daily_protein_target ?? 145
  const calorieTarget = profile?.daily_calorie_target ?? 1900

  const phasePct = (() => {
    if (!activePhase) return 0
    const start = Date.UTC(
      Number(activePhase.start_date.slice(0, 4)),
      Number(activePhase.start_date.slice(5, 7)) - 1,
      Number(activePhase.start_date.slice(8, 10))
    )
    const end = Date.UTC(
      Number(activePhase.end_date.slice(0, 4)),
      Number(activePhase.end_date.slice(5, 7)) - 1,
      Number(activePhase.end_date.slice(8, 10))
    )
    const total = Math.floor((end - start) / 86_400_000)
    const elapsed = Math.floor((Date.now() - start) / 86_400_000)
    return total > 0 ? Math.max(0, Math.min(100, Math.round((elapsed / total) * 100))) : 0
  })()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium" style={{ color: FT.textMuted }}>
          Day {dayNum} of {totalPlanDays || '-'} &middot; {activePhase?.name ?? 'No phase'} phase
        </span>
        <div className="flex items-center gap-1.5">
          {streak.thisWeek.target > 0 && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: streak.thisWeek.met ? FT.successBg : FT.surface,
                color: streak.thisWeek.met ? FT.success : FT.textSecondary,
                border: `1px solid ${FT.border}`,
              }}
            >
              {streak.thisWeek.count}/{streak.thisWeek.target} this week
            </span>
          )}
          {streak.weeksStreak > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: FT.warningBg, color: FT.warning }}
            >
              {streak.weeksStreak}w streak
            </span>
          )}
        </div>
      </div>

      {todayWorkout && (
        <div
          className="rounded-xl p-3"
          style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: FT.textMuted }}>
              Today&apos;s Workout
            </p>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: workoutColor(todayWorkout.type ?? '').bg,
                color: workoutColor(todayWorkout.type ?? '').text,
              }}
            >
              {workoutColor(todayWorkout.type ?? '').label}
            </span>
          </div>
          {todayWorkout.title && (
            <p className="text-sm font-medium" style={{ color: FT.textPrimary }}>
              {todayWorkout.title}
            </p>
          )}
          <div className="flex gap-3 mt-1 text-xs" style={{ color: FT.textMuted }}>
            {todayWorkout.duration_mins && <span>{todayWorkout.duration_mins} min</span>}
            {todayWorkout.volume_kg && <span>{Number(todayWorkout.volume_kg).toLocaleString()} kg</span>}
          </div>
        </div>
      )}

      <div
        className="rounded-xl p-3"
        style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
          Today&apos;s Macros
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: FT.textSecondary }}>Protein</span>
            <span className="font-semibold" style={{ color: FT.textPrimary }}>
              {Math.round(todayMacros.protein_g)}
              <span className="font-normal" style={{ color: FT.textMuted }}> /{proteinTarget}g</span>
            </span>
          </div>
          <OverviewProgressBar value={todayMacros.protein_g} max={proteinTarget} color={FT.accent} />
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: FT.textSecondary }}>Calories</span>
            <span className="font-semibold" style={{ color: FT.textPrimary }}>
              {Math.round(todayMacros.calories)}
              <span className="font-normal" style={{ color: FT.textMuted }}> /{calorieTarget}</span>
            </span>
          </div>
          <OverviewProgressBar value={todayMacros.calories} max={calorieTarget} color="#7c3aed" />
        </div>
      </div>

      {activePhase && (
        <div
          className="rounded-xl p-3"
          style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold" style={{ color: FT.textSecondary }}>
              Phase {activePhase.phase_number}: {activePhase.name}
            </p>
            <span className="text-xs" style={{ color: FT.textMuted }}>{phasePct}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: swatch.bg }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${phasePct}%`, background: swatch.border }}
            />
          </div>
          {activePhase.focus && (
            <p className="text-[11px] mt-2" style={{ color: FT.textMuted }}>
              {activePhase.focus}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Link
          href="/fit/body"
          className="flex-1 rounded-xl p-3 text-center text-sm font-medium"
          style={{ background: FT.surface, border: `1px solid ${FT.border}`, color: FT.accent }}
        >
          Body &amp; Meals
        </Link>
        <Link
          href="/fit/train"
          className="flex-1 rounded-xl p-3 text-center text-sm font-medium"
          style={{ background: FT.surface, border: `1px solid ${FT.border}`, color: FT.accent }}
        >
          Train
        </Link>
      </div>
    </div>
  )
}
