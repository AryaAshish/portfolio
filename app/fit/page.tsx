import type { Metadata } from 'next'
import Link from 'next/link'
import { createFitPublicServerClient } from '@/lib/fit-public/client-server'
import {
  getUserProfile,
  getTodayMacros,
  getWorkoutForDate,
  getWorkoutsForWeek,
  getExerciseLogsForWorkout,
  getExerciseComparisons,
  getAllWorkouts,
  getExercisesForWorkoutType,
  getWeeklyGymStreak,
  getPlanPhases,
} from '@/lib/fit-public/data'
import {
  currentWeekMonday,
  todayISO,
  todayWeekIndex,
} from '@/fittrack/plan-config'
import {
  getCurrentPhase,
  getPlanDayNumber,
  getPlanStartISO,
  getPlanTotalDays,
} from '@/lib/fittrack/plan-helpers'
import { FT, phaseSwatch } from '@/app/fittrack/_components/tokens'
import { WorkoutLogFormPublic } from './_components/WorkoutLogFormPublic'
import { WorkoutCard } from '@/app/fittrack/_components/WorkoutCard'
import { WeekStrip } from '@/app/fittrack/_components/WeekStrip'
import { OverviewProgressBar } from '@/app/fittrack/_components/OverviewProgressBar'
import { DayTypePicker } from '@/app/fittrack/_components/DayTypePicker'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'FitTrack' }

const ROTATION = ['push', 'pull', 'legs', 'auxiliary', 'cardio']

function inferNextType(lastType: string | null): string {
  if (!lastType) return 'push'
  const idx = ROTATION.indexOf(lastType.toLowerCase())
  if (idx === -1) return 'push'
  return ROTATION[(idx + 1) % ROTATION.length]
}

export default async function FitOverviewPage() {
  const today = todayISO()
  const mondayDate = currentWeekMonday()
  const client = createFitPublicServerClient()

  const [profile, todayMacros, todayWorkout, weekWorkouts, recentWorkouts, streak, planPhases] =
    await Promise.all([
      getUserProfile(client),
      getTodayMacros(client, today),
      getWorkoutForDate(client, today),
      getWorkoutsForWeek(client, mondayDate),
      getAllWorkouts(client, 3),
      getWeeklyGymStreak(client),
      getPlanPhases(client),
    ])

  const exerciseLogs = todayWorkout
    ? await getExerciseLogsForWorkout(client, todayWorkout.id)
    : []

  const exerciseNames = [...new Set(exerciseLogs.map((l) => l.exercise_name))]
  const comparisons = exerciseNames.length > 0
    ? await getExerciseComparisons(client, exerciseNames, today)
    : []

  const lastType = recentWorkouts.length > 0 ? recentWorkouts[0].type : null
  const inferredType = todayWorkout ? todayWorkout.type : inferNextType(lastType)

  const allTypes = ['push', 'pull', 'legs', 'auxiliary', 'cardio']
  const exercisesByType: Record<string, Awaited<ReturnType<typeof getExercisesForWorkoutType>>> = {}
  const typeResults = await Promise.all(
    allTypes.map((t) => getExercisesForWorkoutType(client, t))
  )
  allTypes.forEach((t, i) => {
    exercisesByType[t] = typeResults[i]
  })

  const activePhase = getCurrentPhase(today, planPhases)
  const planStartISO = getPlanStartISO(planPhases)
  const totalPlanDays = getPlanTotalDays(planPhases)
  const dayNum = planStartISO ? getPlanDayNumber(today, planStartISO) : 1
  const swatch = activePhase ? phaseSwatch(activePhase.phase_number) : phaseSwatch(1)
  const weekIdx = todayWeekIndex()

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
        <Link
          href="/fit/plan"
          className="text-xs font-medium hover:underline"
          style={{ color: FT.textMuted }}
        >
          Day {dayNum} of {totalPlanDays || '-'} &middot; {activePhase?.name ?? 'No phase'} phase
        </Link>
        <div className="flex items-center gap-1.5">
          {streak.thisWeek.target > 0 && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: streak.thisWeek.met ? FT.successBg : FT.surface,
                color: streak.thisWeek.met ? FT.success : FT.textSecondary,
                border: `1px solid ${FT.border}`,
              }}
              title="Gym days this week (push / pull / legs / auxiliary)"
            >
              {streak.thisWeek.count}/{streak.thisWeek.target} this week
            </span>
          )}
          {streak.weeksStreak > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: FT.warningBg, color: FT.warning }}
              title="Consecutive weeks hitting your gym target"
            >
              {streak.weeksStreak}w streak
            </span>
          )}
        </div>
      </div>

      <WorkoutLogFormPublic hasWorkoutToday={!!todayWorkout} />

      {todayWorkout && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
            Today
          </p>
          <WorkoutCard workout={todayWorkout} exerciseLogs={exerciseLogs} comparisons={comparisons} linkableExercises editable basePath="/fit" />
        </div>
      )}

      <DayTypePicker inferredType={inferredType} exercisesByType={exercisesByType} />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
          This Week
        </p>
        <div
          className="rounded-xl p-3"
          style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
        >
          <WeekStrip mondayDate={mondayDate} todayIdx={weekIdx} workouts={weekWorkouts} basePath="/fit" />
        </div>
      </div>

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
              <span className="font-normal" style={{ color: FT.textMuted }}>
                {' '}/{proteinTarget}g
              </span>
            </span>
          </div>
          <OverviewProgressBar
            value={todayMacros.protein_g}
            max={proteinTarget}
            color={FT.accent}
          />
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: FT.textSecondary }}>Calories</span>
            <span className="font-semibold" style={{ color: FT.textPrimary }}>
              {Math.round(todayMacros.calories)}
              <span className="font-normal" style={{ color: FT.textMuted }}>
                {' '}/{calorieTarget}
              </span>
            </span>
          </div>
          <OverviewProgressBar
            value={todayMacros.calories}
            max={calorieTarget}
            color="#7c3aed"
          />
        </div>
      </div>

      {activePhase && (
        <Link
          href="/fit/plan"
          className="block rounded-xl p-3"
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
        </Link>
      )}
    </div>
  )
}
