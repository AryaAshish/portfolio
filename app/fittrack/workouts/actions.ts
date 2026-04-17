'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ingestMotraWorkout } from '@/lib/fittrack/ingest-motra'
import { parseMotraShareText } from '@/lib/fittrack/motra-parse'
import { isValidLogDate } from '@/lib/fittrack/validate-log-date'
import {
  updateWorkout,
  deleteWorkoutById,
  getWorkoutById,
  getWorkoutForDate,
  getExerciseLogsForWorkout,
  insertExerciseLog,
  updateExerciseLog,
  deleteExerciseLog,
} from '@/lib/fittrack-supabase'
import type { Workout } from '@/lib/fittrack-supabase'
import type {
  LogWorkoutConflictMode,
  LogWorkoutResult,
  SetPatch,
  UpdateWorkoutResult,
} from './types'
import { runUpdateWorkout } from '@/lib/fittrack/update-workout'

const VALID_TYPES: Workout['type'][] = ['push', 'pull', 'legs', 'auxiliary', 'cardio', 'rest']

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function logMotraWorkoutFromForm(
  text: string,
  typeOverride?: string | null,
  dateOverride?: string | null,
  conflictMode?: LogWorkoutConflictMode | null
): Promise<LogWorkoutResult> {
  const trimmed = text.trim()
  if (!trimmed) {
    return { ok: false, code: 'BAD_REQUEST', message: 'Paste is empty' }
  }

  const today = todayISO()
  const resolvedDate = dateOverride ?? today
  if (!isValidLogDate(resolvedDate, today)) {
    return { ok: false, code: 'BAD_REQUEST', message: 'Invalid workout date' }
  }

  const override =
    typeOverride && VALID_TYPES.includes(typeOverride as Workout['type'])
      ? (typeOverride as Workout['type'])
      : null

  try {
    if (conflictMode == null) {
      const existing = await getWorkoutForDate(resolvedDate)
      if (existing) {
        return {
          ok: false,
          code: 'DATE_CONFLICT',
          existing: {
            id: existing.id,
            title: existing.title,
            type: existing.type,
            date: existing.date,
          },
          message: 'A workout is already logged on this date',
        }
      }
    } else if (conflictMode === 'override') {
      const parsedCheck = parseMotraShareText(trimmed)
      if (parsedCheck.exerciseLogs.length === 0) {
        return { ok: false, code: 'BAD_PASTE', message: 'Could not parse workout from paste' }
      }
      const existing = await getWorkoutForDate(resolvedDate)
      if (existing) {
        await deleteWorkoutById(existing.id)
      }
    }

    const { workoutId } = await ingestMotraWorkout(trimmed, override, resolvedDate)
    revalidatePath('/fittrack')
    revalidatePath('/fittrack/train')
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
