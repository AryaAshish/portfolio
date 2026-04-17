import { describe, expect, it } from 'vitest'
import {
  getCurrentPhase,
  getPlanDayNumber,
  getPlanStartISO,
  getPlanTotalDays,
  validatePhases,
  type PhaseInput,
} from './plan-helpers'

const DEFAULT: PhaseInput[] = [
  { phase_number: 1, name: 'Foundation', start_date: '2026-04-14', end_date: '2026-05-11', focus: null },
  { phase_number: 2, name: 'Body Composition', start_date: '2026-05-12', end_date: '2026-06-08', focus: null },
  { phase_number: 3, name: 'Peak Condition', start_date: '2026-06-09', end_date: '2026-07-06', focus: null },
]

describe('getCurrentPhase', () => {
  it('returns null for empty list', () => {
    expect(getCurrentPhase('2026-04-20', [])).toBeNull()
  })

  it('returns first phase when today is before it', () => {
    expect(getCurrentPhase('2026-04-01', DEFAULT)?.phase_number).toBe(1)
  })

  it('returns the matching phase when today is inside it', () => {
    expect(getCurrentPhase('2026-04-20', DEFAULT)?.phase_number).toBe(1)
    expect(getCurrentPhase('2026-05-20', DEFAULT)?.phase_number).toBe(2)
    expect(getCurrentPhase('2026-06-15', DEFAULT)?.phase_number).toBe(3)
  })

  it('returns matching phase on boundary days (start and end inclusive)', () => {
    expect(getCurrentPhase('2026-04-14', DEFAULT)?.phase_number).toBe(1)
    expect(getCurrentPhase('2026-05-11', DEFAULT)?.phase_number).toBe(1)
    expect(getCurrentPhase('2026-05-12', DEFAULT)?.phase_number).toBe(2)
  })

  it('returns last phase when today is after all phases', () => {
    expect(getCurrentPhase('2027-01-01', DEFAULT)?.phase_number).toBe(3)
  })

  it('handles a single phase', () => {
    const single: PhaseInput[] = [DEFAULT[0]]
    expect(getCurrentPhase('2026-04-20', single)?.phase_number).toBe(1)
    expect(getCurrentPhase('2026-01-01', single)?.phase_number).toBe(1)
    expect(getCurrentPhase('2027-01-01', single)?.phase_number).toBe(1)
  })

  it('returns first matching phase on overlap (by phase_number order)', () => {
    const overlapping: PhaseInput[] = [
      { phase_number: 1, name: 'A', start_date: '2026-04-01', end_date: '2026-04-30', focus: null },
      { phase_number: 2, name: 'B', start_date: '2026-04-20', end_date: '2026-05-20', focus: null },
    ]
    expect(getCurrentPhase('2026-04-25', overlapping)?.phase_number).toBe(1)
  })
})

describe('getPlanStartISO', () => {
  it('returns null for empty list', () => {
    expect(getPlanStartISO([])).toBeNull()
  })
  it('returns first phase start date', () => {
    expect(getPlanStartISO(DEFAULT)).toBe('2026-04-14')
  })
  it('picks earliest by phase_number even when input is unordered', () => {
    const unordered = [DEFAULT[2], DEFAULT[0], DEFAULT[1]]
    expect(getPlanStartISO(unordered)).toBe('2026-04-14')
  })
})

describe('getPlanDayNumber', () => {
  it('returns 1 on plan start', () => {
    expect(getPlanDayNumber('2026-04-14', '2026-04-14')).toBe(1)
  })
  it('returns correct day inside the plan', () => {
    expect(getPlanDayNumber('2026-04-16', '2026-04-14')).toBe(3)
    expect(getPlanDayNumber('2026-05-12', '2026-04-14')).toBe(29)
  })
  it('clamps to 1 when today is before plan start', () => {
    expect(getPlanDayNumber('2026-04-01', '2026-04-14')).toBe(1)
  })
})

describe('getPlanTotalDays', () => {
  it('returns 0 for empty list', () => {
    expect(getPlanTotalDays([])).toBe(0)
  })
  it('returns 84 for 3 four-week phases (28 days each, inclusive)', () => {
    expect(getPlanTotalDays(DEFAULT)).toBe(84)
  })
  it('handles a single phase', () => {
    expect(getPlanTotalDays([DEFAULT[0]])).toBe(28)
  })
})

describe('validatePhases', () => {
  it('returns no errors for a valid default list', () => {
    expect(validatePhases(DEFAULT)).toEqual([])
  })
  it('flags empty name', () => {
    const bad: PhaseInput[] = [{ ...DEFAULT[0], name: '' }]
    expect(validatePhases(bad)).toEqual([{ index: 0, message: 'Name is required' }])
  })
  it('flags end before start', () => {
    const bad: PhaseInput[] = [{ ...DEFAULT[0], end_date: '2026-04-10' }]
    const errs = validatePhases(bad)
    expect(errs).toContainEqual({ index: 0, message: 'End date must be on or after start date' })
  })
  it('flags overlapping phases', () => {
    const overlapping: PhaseInput[] = [
      { ...DEFAULT[0] },
      { ...DEFAULT[1], start_date: '2026-05-11' },
    ]
    const errs = validatePhases(overlapping)
    expect(errs.some((e) => e.message.includes('Overlaps'))).toBe(true)
  })
  it('does NOT flag adjacent phases where one starts the day after another ends', () => {
    const adj: PhaseInput[] = [DEFAULT[0], DEFAULT[1]]
    expect(validatePhases(adj)).toEqual([])
  })
})
