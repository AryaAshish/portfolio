'use client'

import { useRouter } from 'next/navigation'
import { FT } from './tokens'

function shiftDate(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function formatDisplay(iso: string, todayIso: string): string {
  if (iso === todayIso) return 'Today'
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function BodyDateNav({ date, today }: { date: string; today: string }) {
  const router = useRouter()
  const isToday = date === today

  function go(iso: string) {
    if (iso === today) {
      router.push('/fittrack/body')
    } else {
      router.push(`/fittrack/body?date=${iso}`)
    }
  }

  return (
    <div className="flex items-center justify-between mb-3">
      <button
        type="button"
        onClick={() => go(shiftDate(date, -1))}
        className="p-1.5 rounded-lg text-sm font-medium"
        style={{ color: FT.textMuted }}
      >
        ←
      </button>
      <span className="text-sm font-semibold" style={{ color: FT.textPrimary }}>
        {formatDisplay(date, today)}
      </span>
      <div className="flex items-center gap-2">
        {!isToday && (
          <button
            type="button"
            onClick={() => go(today)}
            className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded"
            style={{ background: FT.accentBg, color: FT.accent }}
          >
            Today
          </button>
        )}
        <button
          type="button"
          onClick={() => go(shiftDate(date, 1))}
          className="p-1.5 rounded-lg text-sm font-medium"
          style={{ color: isToday ? FT.textDisabled : FT.textMuted }}
          disabled={isToday}
        >
          →
        </button>
      </div>
    </div>
  )
}
