export const PLAN_START = '2026-04-14'

export type PlanPhase = {
  number: number
  name: string
  weeks: string
  start: Date
  end: Date
  focus: string
  accentBg: string
  accentText: string
  borderActive: string
}

export const PHASES: PlanPhase[] = [
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

export function currentWeekMonday(): string {
  const today = new Date()
  const jsDay = today.getDay()
  const diff = (jsDay + 6) % 7
  const mon = new Date(today)
  mon.setDate(mon.getDate() - diff)
  return mon.toISOString().split('T')[0]
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function todayWeekIndex(): number {
  const jsDay = new Date().getDay()
  return (jsDay + 6) % 7
}

export function currentPhase(): PlanPhase {
  const today = new Date()
  return (
    PHASES.find((p) => today >= p.start && today <= p.end) ??
    (today < PHASES[0].start ? PHASES[0] : PHASES[PHASES.length - 1])
  )
}

export function planDayNumber(): number {
  const start = new Date(PLAN_START)
  const today = new Date()
  const diff = Math.floor((today.getTime() - start.getTime()) / 86_400_000)
  return Math.max(1, diff + 1)
}
