export type PhaseInput = {
  phase_number: number
  name: string
  start_date: string
  end_date: string
  focus?: string | null
}

function toUTCDate(iso: string): number {
  return Date.UTC(
    Number(iso.slice(0, 4)),
    Number(iso.slice(5, 7)) - 1,
    Number(iso.slice(8, 10))
  )
}

const DAY_MS = 86_400_000

export function getCurrentPhase<T extends PhaseInput>(
  todayISO: string,
  phases: T[]
): T | null {
  if (phases.length === 0) return null
  const sorted = [...phases].sort((a, b) => a.phase_number - b.phase_number)
  const t = toUTCDate(todayISO)
  for (const p of sorted) {
    const s = toUTCDate(p.start_date)
    const e = toUTCDate(p.end_date)
    if (t >= s && t <= e) return p
  }
  const first = sorted[0]
  if (t < toUTCDate(first.start_date)) return first
  return sorted[sorted.length - 1]
}

export function getPlanStartISO<T extends PhaseInput>(phases: T[]): string | null {
  if (phases.length === 0) return null
  const sorted = [...phases].sort((a, b) => a.phase_number - b.phase_number)
  return sorted[0].start_date
}

export function getPlanDayNumber(todayISO: string, planStartISO: string): number {
  const diff = Math.floor((toUTCDate(todayISO) - toUTCDate(planStartISO)) / DAY_MS)
  return Math.max(1, diff + 1)
}

export function getPlanTotalDays<T extends PhaseInput>(phases: T[]): number {
  if (phases.length === 0) return 0
  const sorted = [...phases].sort((a, b) => a.phase_number - b.phase_number)
  const start = toUTCDate(sorted[0].start_date)
  const end = toUTCDate(sorted[sorted.length - 1].end_date)
  return Math.floor((end - start) / DAY_MS) + 1
}

export type PhaseValidationError = {
  index: number
  message: string
}

export function validatePhases<T extends PhaseInput>(phases: T[]): PhaseValidationError[] {
  const errs: PhaseValidationError[] = []
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i]
    if (!p.name || !p.name.trim()) {
      errs.push({ index: i, message: 'Name is required' })
    }
    if (!p.start_date || !p.end_date) {
      errs.push({ index: i, message: 'Start and end dates are required' })
      continue
    }
    if (toUTCDate(p.start_date) > toUTCDate(p.end_date)) {
      errs.push({ index: i, message: 'End date must be on or after start date' })
    }
  }
  const sorted = [...phases].sort((a, b) => a.phase_number - b.phase_number)
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const cur = sorted[i]
    if (!prev.end_date || !cur.start_date) continue
    if (toUTCDate(cur.start_date) <= toUTCDate(prev.end_date)) {
      errs.push({
        index: phases.indexOf(cur),
        message: `Overlaps phase ${prev.phase_number}`,
      })
    }
  }
  return errs
}
