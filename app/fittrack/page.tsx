import type { Metadata } from 'next'
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
} from '@/lib/fittrack-supabase'
import {
  currentPhase,
  currentWeekMonday,
  planDayNumber,
  todayISO,
  todayWeekIndex,
} from '@/fittrack/plan-config'
import { FT } from './_components/tokens'
import { WorkoutLogForm } from './_components/WorkoutLogForm'
import { WorkoutCard } from './_components/WorkoutCard'
import { WeekStrip } from './_components/WeekStrip'
import { OverviewProgressBar } from './_components/OverviewProgressBar'
import { DayTypePicker } from './_components/DayTypePicker'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'FitTrack' }

const ROTATION = ['push', 'pull', 'legs', 'auxiliary', 'cardio']

function inferNextType(lastType: string | null): string {
  if (!lastType) return 'push'
  const idx = ROTATION.indexOf(lastType.toLowerCase())
  if (idx === -1) return 'push'
  return ROTATION[(idx + 1) % ROTATION.length]
}

export default async function TodayPage() {
  const today = todayISO()
  const mondayDate = currentWeekMonday()

  const [profile, todayMacros, todayWorkout, weekWorkouts, recentWorkouts, streak] =
    await Promise.all([
      getUserProfile(),
      getTodayMacros(today),
      getWorkoutForDate(today),
      getWorkoutsForWeek(mondayDate),
      getAllWorkouts(3),
      getWeeklyGymStreak(),
    ])

  const exerciseLogs = todayWorkout
    ? await getExerciseLogsForWorkout(todayWorkout.id)
    : []

  const exerciseNames = [...new Set(exerciseLogs.map((l) => l.exercise_name))]
  const comparisons = exerciseNames.length > 0
    ? await getExerciseComparisons(exerciseNames, today)
    : []

  const lastType = recentWorkouts.length > 0 ? recentWorkouts[0].type : null
  const inferredType = todayWorkout ? todayWorkout.type : inferNextType(lastType)

  const allTypes = ['push', 'pull', 'legs', 'auxiliary', 'cardio']
  const exercisesByType: Record<string, Awaited<ReturnType<typeof getExercisesForWorkoutType>>> = {}
  const typeResults = await Promise.all(
    allTypes.map((t) => getExercisesForWorkoutType(t))
  )
  allTypes.forEach((t, i) => {
    exercisesByType[t] = typeResults[i]
  })

  const activePhase = currentPhase()
  const dayNum = planDayNumber()
  const weekIdx = todayWeekIndex()

  const proteinTarget = profile?.daily_protein_target ?? 145
  const calorieTarget = profile?.daily_calorie_target ?? 1900

  const phasePct = (() => {
    const elapsed = Math.floor((Date.now() - activePhase.start.getTime()) / 86_400_000)
    const total = Math.floor((activePhase.end.getTime() - activePhase.start.getTime()) / 86_400_000)
    return total > 0 ? Math.min(100, Math.round((elapsed / total) * 100)) : 0
  })()

  return (
    <div className="space-y-5">
      {/* Greeting + Weekly Streak */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium" style={{ color: FT.textMuted }}>
          Day {dayNum} of 84 &middot; {activePhase.name} phase
        </p>
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

      {/* Quick Log */}
      <WorkoutLogForm hasWorkoutToday={!!todayWorkout} />

      {/* Today's Workout */}
      {todayWorkout && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
            Today
          </p>
          <WorkoutCard workout={todayWorkout} exerciseLogs={exerciseLogs} comparisons={comparisons} linkableExercises editable />
        </div>
      )}

      {/* Day Type + Suggested Exercises */}
      <DayTypePicker inferredType={inferredType} exercisesByType={exercisesByType} />

      {/* Week Strip */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
          This Week
        </p>
        <div
          className="rounded-xl p-3"
          style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
        >
          <WeekStrip mondayDate={mondayDate} todayIdx={weekIdx} workouts={weekWorkouts} />
        </div>
      </div>

      {/* Macros */}
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

      {/* Phase Progress */}
      <div
        className="rounded-xl p-3"
        style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold" style={{ color: FT.textSecondary }}>
            Phase {activePhase.number}: {activePhase.name}
          </p>
          <span className="text-xs" style={{ color: FT.textMuted }}>{phasePct}%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: activePhase.accentBg }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${phasePct}%`, background: activePhase.borderActive }}
          />
        </div>
      </div>
    </div>
  )
}
