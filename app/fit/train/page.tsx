import type { Metadata } from 'next'
import Link from 'next/link'
import { createFitPublicServerClient } from '@/lib/fit-public/client-server'
import {
  getAllWorkouts,
  getAllWorkoutsForDate,
  getWorkoutsForCalendar,
  getExerciseLogsForWorkout,
  getDistinctExerciseNames,
  getExerciseProgress,
  getExerciseSessionHistory,
} from '@/lib/fit-public/data'
import { FT, workoutColor } from '@/app/fittrack/_components/tokens'
import { WorkoutCard } from '@/app/fittrack/_components/WorkoutCard'
import { ExerciseDetail } from '@/app/fittrack/_components/ExerciseDetail'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Train' }

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatVolume(kg: number | null): string | null {
  if (kg == null) return null
  const n = Number(kg)
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K kg` : `${Math.round(n)} kg`
}

function getWeekKey(date: string): string {
  const d = new Date(date + 'T00:00:00')
  const jsDay = d.getDay()
  const diff = (jsDay + 6) % 7
  const mon = new Date(d)
  mon.setDate(mon.getDate() - diff)
  const sun = new Date(mon)
  sun.setDate(sun.getDate() + 6)
  const mf = mon.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  const sf = sun.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  return `${mf} – ${sf}`
}

function getWeekMonday(date: string): string {
  const d = new Date(date + 'T00:00:00')
  const jsDay = d.getDay()
  const diff = (jsDay + 6) % 7
  d.setDate(d.getDate() - diff)
  return d.toISOString().split('T')[0]
}

type WorkoutData = Awaited<ReturnType<typeof getAllWorkouts>>
type WeekGroup = { label: string; monday: string; workouts: WorkoutData; totalVolume: number }

function groupByWeek(workouts: WorkoutData): WeekGroup[] {
  const map = new Map<string, WeekGroup>()
  for (const w of workouts) {
    const monday = getWeekMonday(w.date)
    let g = map.get(monday)
    if (!g) { g = { label: getWeekKey(w.date), monday, workouts: [], totalVolume: 0 }; map.set(monday, g) }
    g.workouts.push(w)
    g.totalVolume += Number(w.volume_kg ?? 0)
  }
  return Array.from(map.values()).sort((a, b) => b.monday.localeCompare(a.monday))
}

export default async function FitTrainPage({
  searchParams,
}: {
  searchParams: { day?: string; month?: string; year?: string; exercise?: string }
}) {
  const client = createFitPublicServerClient()
  const selectedDay = searchParams.day ?? null
  const selectedExercise = searchParams.exercise ?? null

  const now = new Date()
  const calYear = parseInt(searchParams.year ?? '', 10) || now.getFullYear()
  const calMonth = parseInt(searchParams.month ?? '', 10) || (now.getMonth() + 1)

  const [allWorkouts, calendarWorkouts, exerciseNames] = await Promise.all([
    getAllWorkouts(client, 60),
    getWorkoutsForCalendar(client, calYear, calMonth),
    getDistinctExerciseNames(client),
  ])

  let exerciseProgression: Awaited<ReturnType<typeof getExerciseProgress>> = []
  let exerciseSessions: Awaited<ReturnType<typeof getExerciseSessionHistory>> = []
  if (selectedExercise) {
    ;[exerciseProgression, exerciseSessions] = await Promise.all([
      getExerciseProgress(client, selectedExercise),
      getExerciseSessionHistory(client, selectedExercise),
    ])
  }

  const calByDate = new Map(calendarWorkouts.map((w: any) => [w.date, w]))

  let selectedWorkouts: { workout: any; logs: any[] }[] = []
  if (selectedDay) {
    const dayWorkouts = await getAllWorkoutsForDate(client, selectedDay)
    selectedWorkouts = await Promise.all(
      dayWorkouts.map(async (w) => ({
        workout: w,
        logs: await getExerciseLogsForWorkout(client, w.id),
      }))
    )
  }

  const startOfMonth = new Date(calYear, calMonth - 1, 1)
  const daysInMonth = new Date(calYear, calMonth, 0).getDate()
  const mondayOffset = (startOfMonth.getDay() + 6) % 7
  const cells: (number | null)[] = [...Array(mondayOffset).fill(null)]
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const prevM = calMonth === 1 ? 12 : calMonth - 1
  const prevY = calMonth === 1 ? calYear - 1 : calYear
  const nextM = calMonth === 12 ? 1 : calMonth + 1
  const nextY = calMonth === 12 ? calYear + 1 : calYear

  const monthLabel = new Date(calYear, calMonth - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const weeks = groupByWeek(allWorkouts)
  const todayISO = now.toISOString().split('T')[0]

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-3" style={{ background: FT.surface, border: `1px solid ${FT.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <Link href={`/fit/train?year=${prevY}&month=${prevM}`} className="p-1 rounded" style={{ color: FT.textMuted }}>←</Link>
          <span className="text-sm font-semibold" style={{ color: FT.textPrimary }}>{monthLabel}</span>
          <Link href={`/fit/train?year=${nextY}&month=${nextM}`} className="p-1 rounded" style={{ color: FT.textMuted }}>→</Link>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold uppercase mb-1" style={{ color: FT.textMuted }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (day === null) return <div key={`p-${i}`} className="aspect-square" />
            const iso = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const w = calByDate.get(iso) as any
            const wc = w ? workoutColor(w.type) : null
            const isToday = iso === todayISO
            const isSelected = iso === selectedDay

            return (
              <Link
                key={iso}
                href={`/fit/train?day=${iso}&year=${calYear}&month=${calMonth}`}
                className="aspect-square flex flex-col items-center justify-center rounded-lg text-[11px] transition-colors"
                style={{
                  color: isSelected ? FT.accent : isToday ? FT.textPrimary : FT.textSecondary,
                  fontWeight: isToday || isSelected ? 700 : 400,
                  border: isSelected ? `2px solid ${FT.accent}` : isToday ? `1px solid ${FT.border}` : 'none',
                  background: isSelected ? FT.accentBg : 'transparent',
                }}
              >
                {day}
                {wc && <span className="rounded-full mt-0.5" style={{ width: 5, height: 5, background: wc.text }} />}
              </Link>
            )
          })}
        </div>
      </div>

      {selectedDay && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>{formatDate(selectedDay)}</p>
          {selectedWorkouts.length > 0 ? (
            <div className="space-y-2">
              {selectedWorkouts.map(({ workout, logs }) => (
                <WorkoutCard key={workout.id} workout={workout} exerciseLogs={logs} linkableExercises editable basePath="/fit" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl p-4 text-center text-sm" style={{ background: FT.surface, border: `1px solid ${FT.border}`, color: FT.textMuted }}>Rest day</div>
          )}
        </div>
      )}

      {!selectedDay && !selectedExercise && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: FT.textMuted }}>Timeline</p>
          {weeks.map((week) => (
            <div key={week.monday}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold" style={{ color: FT.textSecondary }}>{week.label}</p>
                <span className="text-[10px]" style={{ color: FT.textMuted }}>
                  {week.workouts.length} session{week.workouts.length !== 1 ? 's' : ''}
                  {week.totalVolume > 0 && ` · ${formatVolume(week.totalVolume)}`}
                </span>
              </div>
              <div className="space-y-1">
                {week.workouts.map((w) => {
                  const wc = workoutColor(w.type)
                  const vol = formatVolume(w.volume_kg)
                  return (
                    <Link key={w.id} href={`/fit/train?day=${w.date}&year=${calYear}&month=${calMonth}`}
                      className="flex items-center gap-2 rounded-xl p-2.5 transition-colors" style={{ background: FT.surface, border: `1px solid ${FT.border}` }}>
                      <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: wc.text }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: FT.textPrimary }}>{w.title || w.notes || wc.label}</p>
                        <div className="flex flex-wrap gap-2 text-[11px]" style={{ color: FT.textMuted }}>
                          <span>{formatDate(w.date)}</span>
                          {w.duration_mins != null && <span>{w.duration_mins} min</span>}
                          {vol && <span>{vol}</span>}
                          {w.calories_burned != null && <span>{w.calories_burned} cal</span>}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedExercise && (
        <div>
          <Link href="/fit/train" className="inline-block text-xs font-medium mb-3" style={{ color: FT.accent }}>← Back to timeline</Link>
          <ExerciseDetail name={selectedExercise} progression={exerciseProgression} sessions={exerciseSessions} />
        </div>
      )}

      {!selectedDay && !selectedExercise && exerciseNames.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>Exercise Library</p>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${FT.border}`, background: FT.surface }}>
            {exerciseNames.map((name, i) => (
              <Link key={name} href={`/fit/train?exercise=${encodeURIComponent(name)}`}
                className="flex items-center justify-between px-3 py-2.5 text-sm transition-colors"
                style={{ color: FT.textPrimary, borderTop: i > 0 ? `1px solid ${FT.borderSubtle}` : 'none' }}>
                <span className="truncate">{name}</span>
                <span style={{ color: FT.textMuted }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
