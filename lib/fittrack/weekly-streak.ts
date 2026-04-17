export type StreakWorkoutType = 'push' | 'pull' | 'legs' | 'auxiliary' | 'cardio' | 'rest'

export type StreakWorkout = {
  date: string
  type: StreakWorkoutType
}

export type WeeklyStreakResult = {
  weeksStreak: number
  thisWeek: {
    count: number
    target: number
    met: boolean
  }
  currentWeekStart: string
}

const GYM_TYPES: StreakWorkoutType[] = ['push', 'pull', 'legs', 'auxiliary']

function mondayOf(dateISO: string): string {
  const d = new Date(`${dateISO}T00:00:00Z`)
  const day = d.getUTCDay()
  const diff = (day + 6) % 7
  d.setUTCDate(d.getUTCDate() - diff)
  return d.toISOString().slice(0, 10)
}

function shiftWeek(mondayISO: string, weeks: number): string {
  const d = new Date(`${mondayISO}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + weeks * 7)
  return d.toISOString().slice(0, 10)
}

function isGym(w: StreakWorkout): boolean {
  return GYM_TYPES.includes(w.type)
}

export function computeWeeklyStreak(
  workouts: StreakWorkout[],
  target: number,
  todayISO: string
): WeeklyStreakResult {
  const safeTarget = Math.max(0, Math.floor(target))
  const currentWeekStart = mondayOf(todayISO)

  const byWeek = new Map<string, Set<string>>()
  for (const w of workouts) {
    if (!isGym(w)) continue
    const wk = mondayOf(w.date)
    let days = byWeek.get(wk)
    if (!days) {
      days = new Set<string>()
      byWeek.set(wk, days)
    }
    days.add(w.date)
  }

  const thisWeekCount = byWeek.get(currentWeekStart)?.size ?? 0

  let weeksStreak = 0
  if (safeTarget > 0) {
    let cursor = shiftWeek(currentWeekStart, -1)
    while (true) {
      const count = byWeek.get(cursor)?.size ?? 0
      if (count >= safeTarget) {
        weeksStreak += 1
        cursor = shiftWeek(cursor, -1)
      } else {
        break
      }
    }
    if (thisWeekCount >= safeTarget) {
      weeksStreak += 1
    }
  }

  return {
    weeksStreak,
    thisWeek: {
      count: thisWeekCount,
      target: safeTarget,
      met: safeTarget > 0 && thisWeekCount >= safeTarget,
    },
    currentWeekStart,
  }
}
