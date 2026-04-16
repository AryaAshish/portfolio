'use server'

import { ingestMotraWorkout } from '@/lib/fittrack/ingest-motra'
import type { Workout } from '@/lib/fittrack-supabase'

export type LogWorkoutResult =
  | { ok: true; workoutId: string }
  | { ok: false; code: string; message: string }

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
