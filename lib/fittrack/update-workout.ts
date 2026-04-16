import type { ExerciseLog, Workout } from '@/lib/fittrack-supabase'
import type { SetPatch, UpdateWorkoutResult } from '@/app/fittrack/workouts/types'

const VALID_TYPES: Workout['type'][] = ['push', 'pull', 'legs', 'auxiliary', 'cardio', 'rest']
const VALID_SET_TYPES: NonNullable<ExerciseLog['set_type']>[] = ['warmup', 'working', 'dropset', 'cardio']

export type UpdateWorkoutDeps = {
  getWorkoutById: (id: string) => Promise<Workout | null>
  updateWorkout: (id: string, patch: Partial<Pick<Workout, 'type' | 'title' | 'notes'>>) => Promise<void>
  getExerciseLogsForWorkout: (id: string) => Promise<ExerciseLog[]>
  deleteExerciseLog: (id: string) => Promise<void>
  updateExerciseLog: (
    id: string,
    patch: Partial<Pick<ExerciseLog, 'reps' | 'weight_kg' | 'set_type' | 'duration_secs' | 'set_number' | 'exercise_name'>>
  ) => Promise<void>
  insertExerciseLog: (log: Omit<ExerciseLog, 'id' | 'created_at'>) => Promise<ExerciseLog>
}

export type UpdateWorkoutInput = {
  workoutId: string
  title: string | null
  type: string
  sets: SetPatch[]
}

export async function runUpdateWorkout(
  deps: UpdateWorkoutDeps,
  input: UpdateWorkoutInput
): Promise<UpdateWorkoutResult> {
  if (!input.workoutId) return { ok: false, message: 'Workout id missing' }

  if (!VALID_TYPES.includes(input.type as Workout['type'])) {
    return { ok: false, message: 'Invalid workout type' }
  }
  const type = input.type as Workout['type']

  const workout = await deps.getWorkoutById(input.workoutId)
  if (!workout) return { ok: false, message: 'Workout not found' }

  try {
    await deps.updateWorkout(input.workoutId, {
      type,
      title: input.title?.trim() ? input.title.trim() : null,
    })

    const existingLogs = await deps.getExerciseLogsForWorkout(input.workoutId)
    const existingIds = new Set(existingLogs.map((l) => l.id))
    const submittedIds = new Set(
      input.sets.filter((s) => s.id && !s.delete).map((s) => s.id as string)
    )

    for (const removedId of Array.from(existingIds).filter((id) => !submittedIds.has(id))) {
      await deps.deleteExerciseLog(removedId)
    }

    for (const s of input.sets) {
      if (s.delete && s.id) continue

      const clean = {
        exercise_name: s.exercise_name.trim(),
        set_number: s.set_number,
        set_type:
          s.set_type && VALID_SET_TYPES.includes(s.set_type)
            ? s.set_type
            : ('working' as NonNullable<ExerciseLog['set_type']>),
        reps: s.reps,
        weight_kg: s.weight_kg,
        duration_secs: s.duration_secs,
      }

      if (!clean.exercise_name) continue

      if (s.id) {
        await deps.updateExerciseLog(s.id, clean)
      } else {
        await deps.insertExerciseLog({
          workout_id: input.workoutId,
          date: workout.date,
          ...clean,
        })
      }
    }

    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, message: msg }
  }
}
