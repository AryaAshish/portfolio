import { describe, expect, it } from 'vitest'
import { computeWeeklyStreak, type StreakWorkout } from './weekly-streak'

const w = (date: string, type: StreakWorkout['type']): StreakWorkout => ({ date, type })

const TODAY = '2026-04-16'
const THIS_MON = '2026-04-13'
const LAST_MON = '2026-04-06'
const TWO_MON = '2026-03-30'
const THREE_MON = '2026-03-23'

describe('computeWeeklyStreak', () => {
  it('returns zero streak and zero progress when no workouts', () => {
    const r = computeWeeklyStreak([], 3, TODAY)
    expect(r.weeksStreak).toBe(0)
    expect(r.thisWeek).toEqual({ count: 0, target: 3, met: false })
    expect(r.currentWeekStart).toBe(THIS_MON)
  })

  it('counts only gym types; cardio and rest are excluded', () => {
    const r = computeWeeklyStreak(
      [
        w(THIS_MON, 'push'),
        w('2026-04-14', 'cardio'),
        w('2026-04-15', 'rest'),
      ],
      3,
      TODAY
    )
    expect(r.thisWeek.count).toBe(1)
  })

  it('collapses multiple workouts on the same date to one gym day', () => {
    const r = computeWeeklyStreak(
      [
        w(THIS_MON, 'push'),
        w(THIS_MON, 'auxiliary'),
      ],
      3,
      TODAY
    )
    expect(r.thisWeek.count).toBe(1)
  })

  it('current week is part of the streak once target is met', () => {
    const r = computeWeeklyStreak(
      [
        w('2026-04-13', 'push'),
        w('2026-04-14', 'pull'),
        w('2026-04-15', 'legs'),
      ],
      3,
      TODAY
    )
    expect(r.thisWeek.met).toBe(true)
    expect(r.weeksStreak).toBe(1)
  })

  it('current week not yet met does not break a past-week streak', () => {
    const r = computeWeeklyStreak(
      [
        w(LAST_MON, 'push'),
        w('2026-04-08', 'pull'),
        w('2026-04-10', 'legs'),
        w(THIS_MON, 'push'),
      ],
      3,
      TODAY
    )
    expect(r.thisWeek.count).toBe(1)
    expect(r.thisWeek.met).toBe(false)
    expect(r.weeksStreak).toBe(1)
  })

  it('counts consecutive met weeks going backward', () => {
    const r = computeWeeklyStreak(
      [
        w(THREE_MON, 'push'),
        w('2026-03-25', 'pull'),
        w('2026-03-27', 'legs'),
        w(TWO_MON, 'push'),
        w('2026-04-01', 'pull'),
        w('2026-04-03', 'legs'),
        w(LAST_MON, 'push'),
        w('2026-04-08', 'pull'),
        w('2026-04-10', 'legs'),
      ],
      3,
      TODAY
    )
    expect(r.thisWeek.count).toBe(0)
    expect(r.weeksStreak).toBe(3)
  })

  it('breaks the streak at the first past week that missed target', () => {
    const r = computeWeeklyStreak(
      [
        w(TWO_MON, 'push'),
        w('2026-04-01', 'pull'),
        w('2026-04-03', 'legs'),
        w(LAST_MON, 'push'),
        w('2026-04-08', 'pull'),
      ],
      3,
      TODAY
    )
    expect(r.weeksStreak).toBe(0)
  })

  it('counts current week even when past week missed', () => {
    const r = computeWeeklyStreak(
      [
        w(LAST_MON, 'push'),
        w(THIS_MON, 'push'),
        w('2026-04-14', 'pull'),
        w('2026-04-15', 'legs'),
      ],
      3,
      TODAY
    )
    expect(r.weeksStreak).toBe(1)
    expect(r.thisWeek.met).toBe(true)
  })

  it('respects a target of 4 (harder week)', () => {
    const r = computeWeeklyStreak(
      [
        w(THIS_MON, 'push'),
        w('2026-04-14', 'pull'),
        w('2026-04-15', 'legs'),
      ],
      4,
      TODAY
    )
    expect(r.thisWeek.count).toBe(3)
    expect(r.thisWeek.met).toBe(false)
    expect(r.weeksStreak).toBe(0)
  })

  it('target of 0 yields no streak and marks this week as not met', () => {
    const r = computeWeeklyStreak(
      [w(THIS_MON, 'push'), w('2026-04-14', 'pull')],
      0,
      TODAY
    )
    expect(r.thisWeek.target).toBe(0)
    expect(r.thisWeek.met).toBe(false)
    expect(r.weeksStreak).toBe(0)
  })

  it('floors a fractional target and clamps negatives to zero', () => {
    const r = computeWeeklyStreak(
      [w(THIS_MON, 'push'), w('2026-04-14', 'pull'), w('2026-04-15', 'legs')],
      2.9,
      TODAY
    )
    expect(r.thisWeek.target).toBe(2)
    expect(r.thisWeek.met).toBe(true)

    const neg = computeWeeklyStreak([w(THIS_MON, 'push')], -3, TODAY)
    expect(neg.thisWeek.target).toBe(0)
  })

  it('computes week boundary as Monday for a Sunday "today"', () => {
    const r = computeWeeklyStreak([], 3, '2026-04-19')
    expect(r.currentWeekStart).toBe(THIS_MON)
  })

  it('computes week boundary as Monday for a Monday "today"', () => {
    const r = computeWeeklyStreak([], 3, THIS_MON)
    expect(r.currentWeekStart).toBe(THIS_MON)
  })
})
