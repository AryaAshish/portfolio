import { describe, expect, it, vi } from 'vitest'
import type { ExerciseLog, Workout } from '@/lib/fittrack-supabase'
import { runUpdateWorkout, type UpdateWorkoutDeps } from './update-workout'

function makeWorkout(): Workout {
  return {
    id: 'w1',
    date: '2026-04-16',
    title: 'Original',
    type: 'push',
    duration_mins: 45,
    volume_kg: 1000,
    calories_burned: 300,
    exercises: null,
    notes: null,
    motra_raw: null,
    created_at: '2026-04-16T10:00:00Z',
  }
}

function makeLog(id: string, overrides: Partial<ExerciseLog> = {}): ExerciseLog {
  return {
    id,
    workout_id: 'w1',
    date: '2026-04-16',
    exercise_name: 'Bench Press',
    set_number: 1,
    set_type: 'working',
    reps: 10,
    weight_kg: 40,
    duration_secs: null,
    created_at: '2026-04-16T10:00:00Z',
    ...overrides,
  }
}

function makeDeps(overrides: Partial<UpdateWorkoutDeps> = {}): UpdateWorkoutDeps {
  return {
    getWorkoutById: vi.fn().mockResolvedValue(makeWorkout()),
    updateWorkout: vi.fn().mockResolvedValue(undefined),
    getExerciseLogsForWorkout: vi.fn().mockResolvedValue([]),
    deleteExerciseLog: vi.fn().mockResolvedValue(undefined),
    updateExerciseLog: vi.fn().mockResolvedValue(undefined),
    insertExerciseLog: vi.fn().mockResolvedValue(makeLog('new1')),
    ...overrides,
  }
}

describe('runUpdateWorkout', () => {
  it('rejects empty workout id', async () => {
    const deps = makeDeps()
    const r = await runUpdateWorkout(deps, {
      workoutId: '',
      title: 'x',
      type: 'push',
      sets: [],
    })
    expect(r).toEqual({ ok: false, message: 'Workout id missing' })
    expect(deps.updateWorkout).not.toHaveBeenCalled()
  })

  it('rejects invalid type', async () => {
    const deps = makeDeps()
    const r = await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: 'x',
      type: 'bogus',
      sets: [],
    })
    expect(r).toEqual({ ok: false, message: 'Invalid workout type' })
    expect(deps.updateWorkout).not.toHaveBeenCalled()
  })

  it('rejects missing workout', async () => {
    const deps = makeDeps({ getWorkoutById: vi.fn().mockResolvedValue(null) })
    const r = await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: 'x',
      type: 'push',
      sets: [],
    })
    expect(r).toEqual({ ok: false, message: 'Workout not found' })
  })

  it('updates workout metadata', async () => {
    const deps = makeDeps()
    await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: '  New Title  ',
      type: 'pull',
      sets: [],
    })
    expect(deps.updateWorkout).toHaveBeenCalledWith('w1', {
      type: 'pull',
      title: 'New Title',
    })
  })

  it('sets title to null when empty/whitespace', async () => {
    const deps = makeDeps()
    await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: '   ',
      type: 'push',
      sets: [],
    })
    expect(deps.updateWorkout).toHaveBeenCalledWith('w1', {
      type: 'push',
      title: null,
    })
  })

  it('updates an existing set by id', async () => {
    const existing = makeLog('s1', { reps: 10, weight_kg: 40 })
    const deps = makeDeps({
      getExerciseLogsForWorkout: vi.fn().mockResolvedValue([existing]),
    })
    const r = await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: null,
      type: 'push',
      sets: [
        {
          id: 's1',
          exercise_name: 'Bench Press',
          set_number: 1,
          set_type: 'working',
          reps: 11,
          weight_kg: 42.5,
          duration_secs: null,
        },
      ],
    })
    expect(r).toEqual({ ok: true })
    expect(deps.updateExerciseLog).toHaveBeenCalledWith('s1', {
      exercise_name: 'Bench Press',
      set_number: 1,
      set_type: 'working',
      reps: 11,
      weight_kg: 42.5,
      duration_secs: null,
    })
    expect(deps.insertExerciseLog).not.toHaveBeenCalled()
    expect(deps.deleteExerciseLog).not.toHaveBeenCalled()
  })

  it('inserts a new set when id is missing', async () => {
    const deps = makeDeps()
    await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: null,
      type: 'push',
      sets: [
        {
          exercise_name: 'Squat',
          set_number: 1,
          set_type: 'working',
          reps: 8,
          weight_kg: 60,
          duration_secs: null,
        },
      ],
    })
    expect(deps.insertExerciseLog).toHaveBeenCalledWith({
      workout_id: 'w1',
      date: '2026-04-16',
      exercise_name: 'Squat',
      set_number: 1,
      set_type: 'working',
      reps: 8,
      weight_kg: 60,
      duration_secs: null,
    })
  })

  it('deletes existing set not present in the patch', async () => {
    const kept = makeLog('s1')
    const dropped = makeLog('s2', { reps: 8 })
    const deps = makeDeps({
      getExerciseLogsForWorkout: vi.fn().mockResolvedValue([kept, dropped]),
    })
    await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: null,
      type: 'push',
      sets: [
        {
          id: 's1',
          exercise_name: 'Bench Press',
          set_number: 1,
          set_type: 'working',
          reps: 10,
          weight_kg: 40,
          duration_secs: null,
        },
      ],
    })
    expect(deps.deleteExerciseLog).toHaveBeenCalledWith('s2')
    expect(deps.deleteExerciseLog).toHaveBeenCalledTimes(1)
  })

  it('honors explicit delete flag on existing set', async () => {
    const existing = makeLog('s1')
    const deps = makeDeps({
      getExerciseLogsForWorkout: vi.fn().mockResolvedValue([existing]),
    })
    await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: null,
      type: 'push',
      sets: [
        {
          id: 's1',
          exercise_name: 'Bench Press',
          set_number: 1,
          set_type: 'working',
          reps: 10,
          weight_kg: 40,
          duration_secs: null,
          delete: true,
        },
      ],
    })
    expect(deps.deleteExerciseLog).toHaveBeenCalledWith('s1')
    expect(deps.updateExerciseLog).not.toHaveBeenCalled()
  })

  it('skips empty exercise names on insert', async () => {
    const deps = makeDeps()
    await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: null,
      type: 'push',
      sets: [
        {
          exercise_name: '   ',
          set_number: 1,
          set_type: 'working',
          reps: 8,
          weight_kg: 60,
          duration_secs: null,
        },
      ],
    })
    expect(deps.insertExerciseLog).not.toHaveBeenCalled()
  })

  it('coerces invalid set_type to working', async () => {
    const deps = makeDeps()
    await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: null,
      type: 'push',
      sets: [
        {
          exercise_name: 'Row',
          set_number: 1,
          set_type: 'bogus' as unknown as ExerciseLog['set_type'],
          reps: 8,
          weight_kg: 40,
          duration_secs: null,
        },
      ],
    })
    const call = (deps.insertExerciseLog as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(call.set_type).toBe('working')
  })

  it('returns ok:false with message when a dep throws', async () => {
    const deps = makeDeps({
      updateWorkout: vi.fn().mockRejectedValue(new Error('db exploded')),
    })
    const r = await runUpdateWorkout(deps, {
      workoutId: 'w1',
      title: null,
      type: 'push',
      sets: [],
    })
    expect(r).toEqual({ ok: false, message: 'db exploded' })
  })
})
