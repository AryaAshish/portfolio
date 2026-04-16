import Link from 'next/link'
import { FT, workoutColor } from './tokens'

type DayWorkout = { date: string; type: string }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WeekStrip({
  mondayDate,
  todayIdx,
  workouts,
}: {
  mondayDate: string
  todayIdx: number
  workouts: DayWorkout[]
}) {
  const byDate = new Map(workouts.map((w) => [w.date, w]))

  return (
    <div className="flex items-center gap-1 justify-between">
      {DAYS.map((day, i) => {
        const d = new Date(mondayDate + 'T00:00:00')
        d.setDate(d.getDate() + i)
        const iso = d.toISOString().split('T')[0]
        const w = byDate.get(iso)
        const wc = w ? workoutColor(w.type) : null
        const isToday = i === todayIdx

        return (
          <Link
            key={iso}
            href={`/fittrack/train?day=${iso}`}
            className="flex flex-col items-center gap-1 flex-1 py-2 rounded-lg transition-colors"
            style={{
              background: isToday ? FT.accentBg : 'transparent',
            }}
          >
            <span
              className="text-[10px] font-semibold uppercase"
              style={{ color: isToday ? FT.accent : FT.textMuted }}
            >
              {day}
            </span>
            <span
              className="rounded-full"
              style={{
                width: 8,
                height: 8,
                background: wc ? wc.text : FT.borderSubtle,
                border: isToday ? `2px solid ${FT.accent}` : 'none',
              }}
            />
          </Link>
        )
      })}
    </div>
  )
}
