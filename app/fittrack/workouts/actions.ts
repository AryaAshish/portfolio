'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ingestMotraWorkout } from '@/lib/fittrack/ingest-motra'
import {
  updateWorkout,
  deleteWorkoutById,
  getWorkoutById,
  getExerciseLogsForWorkout,
  insertExerciseLog,
  updateExerciseLog,
  deleteExerciseLog,
} from '@/lib/fittrack-supabase'
import type { Workout, ExerciseLog } from '@/lib/fittrack-supabase'

export type LogWorkoutResult =
  | { ok: true; workoutId: string }
  | { ok: false; code: string; message: string }

const VALID_TYPES: Workout['type'][] = ['push', 'pull', 'legs', 'auxiliary', 'cardio', 'rest']
const VALID_SET_TYPES: NonNullable<ExerciseLog['set_type']>[] = ['warmup', 'working', 'dropset', 'cardio']

export async function logMotraWorkoutFromForm(
  text: string,
  typeOverride?: string | null
): Promise<LogWorkoutResult> {
  const trimmed = text.trim()
  if (!trimmed) {
    return { ok: false, code: 'BAD_REQUEST', message: 'Paste is empty' }
  }
  const override =
    typeOverride && VALID_TYPES.includes(typeOverride as Workout['type'])
      ? (typeOverride as Workout['type'])
      : null
  try {
    const { workoutId } = await ingestMotraWorkout(trimmed, override)
    return { ok: true, workoutId }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, code: 'ERROR', message: msg }
  }
}

export type UpdateWorkoutResult =
  | { ok: true }
  | { ok: false; message: string }

type SetPatch = {
  id?: string
  exercise_name: string
  set_number: number | null
  set_type: ExerciseLog['set_type']
  reps: number | null
  weight_kg: number | null
  duration_secs: number | null
  delete?: boolean
}

export async function updateWorkoutAction(
  workoutId: string,
  patch: { title: string | null; type: string; sets: SetPatch[] }
): Promise<UpdateWorkoutResult> {
  if (!workoutId) return { ok: false, message: 'Workout id missing' }

  const type = VALID_TYPES.includes(patch.type as Workout['type'])
    ? (patch.type as Workout['type'])
    : null
  if (!type) return { ok: false, message: 'Invalid workout type' }

  const workout = await getWorkoutById(workoutId)
  if (!workout) return { ok: false, message: 'Workout not found' }

  try {
    await updateWorkout(workoutId, {
      type,
      title: patch.title?.trim() ? patch.title.trim() : null,
    })

    const existingLogs = await getExerciseLogsForWorkout(workoutId)
    const existingIds = new Set(existingLogs.map((l) => l.id))
    const submittedIds = new Set(
      patch.sets.filter((s) => s.id && !s.delete).map((s) => s.id as string)
    )

    for (const removedId of Array.from(existingIds).filter((id) => !submittedIds.has(id))) {
      await deleteExerciseLog(removedId)
    }

    for (const s of patch.sets) {
      if (s.delete && s.id) continue

      const clean = {
        exercise_name: s.exercise_name.trim(),
        set_number: s.set_number,
        set_type: s.set_type && VALID_SET_TYPES.includes(s.set_type) ? s.set_type : 'working',
        reps: s.reps,
        weight_kg: s.weight_kg,
        duration_secs: s.duration_secs,
      }

      if (!clean.exercise_name) continue

      if (s.id) {
        await updateExerciseLog(s.id, clean)
      } else {
        await insertExerciseLog({
          workout_id: workoutId,
          date: workout.date,
          ...clean,
        })
      }
    }

    revalidatePath('/fittrack')
    revalidatePath('/fittrack/train')
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, message: msg }
  }
}

export async function deleteWorkoutAction(workoutId: string): Promise<void> {
  if (!workoutId) return
  await deleteWorkoutById(workoutId)
  revalidatePath('/fittrack')
  revalidatePath('/fittrack/train')
  redirect('/fittrack/train')
}
