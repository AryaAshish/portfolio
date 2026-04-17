import { WORKOUT_STYLES } from './WorkoutBadge'

type WeekWorkout = { date: string; type: string; title: string | null }

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function OverviewWeeklyStructure({
  weekIdx,
  mondayDate,
  workouts,
}: {
  weekIdx: number
  mondayDate: string
  workouts: WeekWorkout[]
}) {
  const byDate = new Map(workouts.map((w) => [w.date, w]))

  return (
    <div className="bg-white border border-[#e8e8e4] rounded-[10px] p-4 mb-6">
      <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-3">
        This Week
      </p>
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_LABELS.map((dayLabel, i) => {
          const d = new Date(mondayDate + 'T00:00:00')
          d.setDate(d.getDate() + i)
          const iso = d.toISOString().split('T')[0]
          const w = byDate.get(iso)
          const type = w?.type ?? 'rest'
          const style = WORKOUT_STYLES[type] ?? WORKOUT_STYLES.rest
          const isToday = i === weekIdx
          const title = w?.title ?? null

          const shortTitle = title
            ? title.length > 18
              ? title.slice(0, 16) + '…'
              : title
            : style.label

          return (
            <div
              key={iso}
              style={{
                background: isToday ? style.bg : 'transparent',
                borderRadius: 8,
                border: isToday
                  ? `1.5px solid ${style.text}22`
                  : '1.5px solid #e8e8e4',
              }}
              className="flex flex-col items-center py-2 px-1 gap-1"
            >
              <span
                className="text-[10px] font-semibold uppercase tracking-wide"
                style={{ color: isToday ? style.text : '#999' }}
              >
                {dayLabel}
              </span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: style.bg,
                  border: `1.5px solid ${style.text}`,
                  display: 'block',
                }}
              />
              <span
                className="text-[9px] font-bold uppercase tracking-wide hidden sm:block text-center leading-tight"
                style={{
                  color: isToday ? style.text : '#bbb',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {shortTitle}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
