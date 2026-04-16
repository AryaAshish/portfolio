import { describe, expect, it } from 'vitest'
import { parseMotraShareText } from './motra-parse'

const SAMPLE = `Tuesday Night Full Body Strength with Smith Machine Focus
14 Apr 2026 at 8:39 PM

Duration: 1h 34m
Volume: 4.9K kg
Calories: 533 cal
Exercises: 7

Kettlebell Halo
Warm Up: 11 reps x 10 kg

Smith Machine Bench Press
1: 12 reps x 30 kg
2: 11 reps x 40 kg
3: 11 reps x 40 kg

Smith Machine Shoulder Press
1: 10 reps x 30 kg
Drop Set: 7 reps x 15 kg

Treadmill Walk
1: 05:24

Tracked with Motra.
https://motra.com/share/workout/abc`

describe('parseMotraShareText', () => {
  it('parses date, volume, duration, calories, and sets', () => {
    const p = parseMotraShareText(SAMPLE)
    expect(p.date).toBe('2026-04-14')
    expect(p.volumeKg).toBe(4900)
    expect(p.durationMins).toBe(94)
    expect(p.caloriesBurned).toBe(533)
    expect(p.exerciseLogs.length).toBeGreaterThanOrEqual(7)

    const halo = p.exerciseLogs.filter((r) => r.exercise_name === 'Kettlebell Halo')
    expect(halo.some((r) => r.set_type === 'warmup' && r.reps === 11)).toBe(true)

    const walk = p.exerciseLogs.filter((r) => r.exercise_name === 'Treadmill Walk')
    expect(walk.some((r) => r.set_type === 'cardio' && r.duration_secs === 324)).toBe(true)
  })
})
