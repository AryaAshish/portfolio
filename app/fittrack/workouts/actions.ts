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
import type { Workout } from '@/lib/fittrack-supabase'
import type { LogWorkoutResult, SetPatch, UpdateWorkoutResult } from './types'
import { runUpdateWorkout } from '@/lib/fittrack/update-workout'

const VALID_TYPES: Workout['type'][] = ['push', 'pull', 'legs', 'auxiliary', 'cardio', 'rest']

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

export async function updateWorkoutAction(
  workoutId: string,
  patch: { title: string | null; type: string; sets: SetPatch[] }
): Promise<UpdateWorkoutResult> {
  const result = await runUpdateWorkout(
    {
      getWorkoutById,
      updateWorkout,
      getExerciseLogsForWorkout,
      deleteExerciseLog,
      updateExerciseLog,
      insertExerciseLog,
    },
    { workoutId, ...patch }
  )
  if (result.ok) {
    revalidatePath('/fittrack')
    revalidatePath('/fittrack/train')
  }
  return result
}

export async function deleteWorkoutAction(workoutId: string): Promise<void> {
  if (!workoutId) return
  await deleteWorkoutById(workoutId)
  revalidatePath('/fittrack')
  revalidatePath('/fittrack/train')
  redirect('/fittrack/train')
}
