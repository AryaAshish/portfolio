import type { Metadata } from 'next'
import {
  getUserProfile,
  getLatestWeight,
  getAllWorkouts,
  getMacroTrend,
  getTodayMacros,
} from '@/lib/fittrack-supabase'
import { WorkoutBadge, WORKOUT_STYLES } from './_components/WorkoutBadge'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'FitTrack — Overview' }

// ─── Static plan config ───────────────────────────────────────

const PLAN_START = '2026-04-14'

const PHASES = [
  {
    number: 1,
    name: 'Foundation',
    weeks: '1–4',
    start: new Date('2026-04-14'),
    end: new Date('2026-05-11'),
    focus: 'Caloric deficit, establish training habit, cut body fat',
    accentBg: '#dbeafe',
    accentText: '#1d4ed8',
    borderActive: '#3b82f6',
  },
  {
    number: 2,
    name: 'Body Composition',
    weeks: '5–8',
    start: new Date('2026-05-12'),
    end: new Date('2026-06-08'),
    focus: 'Progressive overload, recheck bloodwork at Week 8',
    accentBg: '#dcfce7',
    accentText: '#15803d',
    borderActive: '#22c55e',
  },
  {
    number: 3,
    name: 'Peak Condition',
    weeks: '9–12',
    start: new Date('2026-06-09'),
    end: new Date('2026-07-06'),
    focus: 'Lean out final 4 weeks, full bloodwork, strength maintenance',
    accentBg: '#fef3c7',
    accentText: '#b45309',
    borderActive: '#f59e0b',
  },
]

const WEEKLY_STRUCTURE: { day: string; type: string }[] = [
  { day: 'Mon', type: 'push' },
  { day: 'Tue', type: 'pull' },
  { day: 'Wed', type: 'legs' },
  { day: 'Thu', type: 'auxiliary' },
  { day: 'Fri', type: 'push' },
  { day: 'Sat', type: 'cardio' },
  { day: 'Sun', type: 'rest' },
]

// ─── Helpers ──────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

/** 0 = Mon … 6 = Sun (matches WEEKLY_STRUCTURE index) */
function todayWeekIndex() {
  const jsDay = new Date().getDay() // 0=Sun … 6=Sat
  return (jsDay + 6) % 7
}

function currentPhase() {
  const today = new Date()
  return (
    PHASES.find((p) => today >= p.start && today <= p.end) ??
    (today < PHASES[0].start ? PHASES[0] : PHASES[PHASES.length - 1])
  )
}

function planDayNumber(): number {
  const start = new Date(PLAN_START)
  const today = new Date()
  const diff = Math.floor((today.getTime() - start.getTime()) / 86_400_000)
  return Math.max(1, diff + 1)
}

// ─── Page ─────────────────────────────────────────────────────

export default async function OverviewPage() {
  const today = todayISO()

  const [profile, latestWeight, workouts, macroTrend, todayMacros] =
    await Promise.all([
      getUserProfile(),
      getLatestWeight(),
      getAllWorkouts(90),
      getMacroTrend(14),
      getTodayMacros(today),
    ])

  // Derived stats
  const daysTrained = workouts.filter((w) => w.type !== 'rest').length
  const avgProtein =
    macroTrend.length > 0
      ? Math.round(
          macroTrend.reduce((s, d) => s + d.protein_g, 0) / macroTrend.length
        )
      : 0

  const todayWorkout = workouts.find((w) => w.date === today) ?? null
  const activePhase = currentPhase()
  const weekIdx = todayWeekIndex()
  const dayNum = planDayNumber()

  const currentWeight = latestWeight?.weight_kg ?? profile?.current_weight_kg ?? null
  const targetWeight = profile?.target_weight_kg ?? null
  const weightToGo =
    currentWeight && targetWeight
      ? (currentWeight - targetWeight).toFixed(1)
      : null

  return (
    <div>
      {/* Header */}
      <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-1">
        Dashboard
      </p>
      <h1 className="font-grotesk text-2xl font-bold text-[#1a1a1a] mb-1">
        3 Month Plan
      </h1>
      <p className="text-sm text-[#999] mb-6">
        Day {dayNum} of 84 &middot; {activePhase.name} phase
      </p>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
        <StatCard
          label="Current Weight"
          value={currentWeight ? `${currentWeight} kg` : '—'}
          sub={weightToGo ? `${weightToGo} kg to go` : undefined}
        />
        <StatCard
          label="Target Weight"
          value={targetWeight ? `${targetWeight} kg` : '—'}
          sub="goal"
        />
        <StatCard
          label="Days Trained"
          value={String(daysTrained)}
          sub="since start"
        />
        <StatCard
          label="Avg Protein"
          value={avgProtein ? `${avgProtein} g` : '—'}
          sub={`14-day avg  (target ${profile?.daily_protein_target ?? 145}g)`}
        />
      </div>

      {/* Today snapshot */}
      <div className="bg-white border border-[#e8e8e4] rounded-[10px] p-4 mb-6">
        <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-3">
          Today
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#666]">Workout</span>
            {todayWorkout ? (
              <WorkoutBadge type={todayWorkout.type} />
            ) : (
              <span className="text-sm text-[#bbb] italic">not logged</span>
            )}
          </div>
          <div className="h-3 w-px bg-[#e8e8e4] hidden sm:block" />
          <div className="flex items-center gap-4 text-sm">
            <span>
              <span className="text-[#999]">Protein </span>
              <span className="font-semibold text-[#1a1a1a]">
                {Math.round(todayMacros.protein_g)}
                <span className="text-[#999] font-normal">
                  /{profile?.daily_protein_target ?? 145}g
                </span>
              </span>
            </span>
            <span>
              <span className="text-[#999]">Calories </span>
              <span className="font-semibold text-[#1a1a1a]">
                {Math.round(todayMacros.calories)}
                <span className="text-[#999] font-normal">
                  /{profile?.daily_calorie_target ?? 1900}
                </span>
              </span>
            </span>
          </div>
        </div>

        {/* Macro progress bars */}
        {(todayMacros.protein_g > 0 || todayMacros.calories > 0) && (
          <div className="mt-3 space-y-1.5">
            <ProgressBar
              value={todayMacros.protein_g}
              max={profile?.daily_protein_target ?? 145}
              color="#1d4ed8"
            />
            <ProgressBar
              value={todayMacros.calories}
              max={profile?.daily_calorie_target ?? 1900}
              color="#7c3aed"
            />
          </div>
        )}
      </div>

      {/* Weekly structure */}
      <div className="bg-white border border-[#e8e8e4] rounded-[10px] p-4 mb-6">
        <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-3">
          Weekly Structure
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKLY_STRUCTURE.map((slot, i) => {
            const style = WORKOUT_STYLES[slot.type]
            const isToday = i === weekIdx
            return (
              <div
                key={slot.day}
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
                  {slot.day}
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
                  className="text-[9px] font-bold uppercase tracking-wide hidden sm:block"
                  style={{ color: isToday ? style.text : '#bbb' }}
                >
                  {style.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Phase grid */}
      <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-3">
        Phase Plan
      </p>
      <div className="space-y-3">
        {PHASES.map((phase) => {
          const today = new Date()
          const isActive = today >= phase.start && today <= phase.end
          const isDone = today > phase.end
          const isUpcoming = today < phase.start

          return (
            <div
              key={phase.number}
              className="bg-white rounded-[10px] p-4"
              style={{
                border: isActive
                  ? `1.5px solid ${phase.borderActive}`
                  : '1px solid #e8e8e4',
                opacity: isUpcoming ? 0.6 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-[4px]"
                      style={{
                        background: isActive || isDone ? phase.accentBg : '#f3f4f6',
                        color: isActive || isDone ? phase.accentText : '#9ca3af',
                      }}
                    >
                      Phase {phase.number}
                    </span>
                    <span className="text-[11px] text-[#999]">
                      Weeks {phase.weeks}
                    </span>
                    {isActive && (
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-[4px]"
                        style={{ background: phase.accentBg, color: phase.accentText }}
                      >
                        Active
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] font-semibold text-[#16a34a] uppercase tracking-wide">
                        ✓ Done
                      </span>
                    )}
                  </div>
                  <h3 className="font-grotesk font-bold text-[#1a1a1a] text-[15px] mb-0.5">
                    {phase.name}
                  </h3>
                  <p className="text-xs text-[#666]">{phase.focus}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-[#999]">
                    {phase.start.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                    {' – '}
                    {phase.end.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>

              {/* Phase progress bar (only for active) */}
              {isActive && (() => {
                const elapsed = Math.floor(
                  (new Date().getTime() - phase.start.getTime()) / 86_400_000
                )
                const total = Math.floor(
                  (phase.end.getTime() - phase.start.getTime()) / 86_400_000
                )
                const pct = Math.min(100, Math.round((elapsed / total) * 100))
                return (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-[#999] mb-1">
                      <span>Progress</span>
                      <span>{pct}%</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ background: phase.accentBg }}
                    >
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: phase.borderActive,
                        }}
                      />
                    </div>
                  </div>
                )
              })()}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-white border border-[#e8e8e4] rounded-[10px] p-3">
      <p className="text-[10px] font-semibold text-[#999] uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="font-grotesk text-xl font-bold text-[#1a1a1a] leading-none mb-0.5">
        {value}
      </p>
      {sub && <p className="text-[10px] text-[#bbb]">{sub}</p>}
    </div>
  )
}

function ProgressBar({
  value,
  max,
  color,
}: {
  value: number
  max: number
  color: string
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-1 rounded-full bg-[#f0f0ee]">
      <div
        className="h-1 rounded-full transition-all"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}
