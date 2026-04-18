import type { SupabaseClient } from '@supabase/supabase-js'
import { parseMotraShareText } from '@/lib/fittrack/motra-parse'
import {
  saveWorkout,
  bulkInsertExerciseLogs,
  deleteWorkoutById,
} from './data'
import type { Workout } from '@/lib/fittrack-supabase'

export async function ingestMotraWorkoutPublic(
  client: SupabaseClient<any, any, any>,
  text: string,
  typeOverride?: Workout['type'] | null,
  dateOverride?: string | null
): Promise<{ workoutId: string }> {
  const parsed = parseMotraShareText(text)
  if (parsed.exerciseLogs.length === 0) {
    throw new Error('No sets parsed from Motra text')
  }

  const workout = await saveWorkout(client, {
    date: dateOverride ?? parsed.date,
    title: parsed.title,
    type: typeOverride ?? parsed.workoutType,
    duration_mins: parsed.durationMins,
    volume_kg: parsed.volumeKg,
    calories_burned: parsed.caloriesBurned,
    exercises: parsed.exercisesSummary,
    notes: null,
    motra_raw: parsed.motraRaw,
  })

  const logs = parsed.exerciseLogs.map((row) => ({
    ...row,
    workout_id: workout.id,
  }))

  try {
    await bulkInsertExerciseLogs(client, logs)
  } catch (e) {
    await deleteWorkoutById(client, workout.id)
    throw e
  }

  return { workoutId: workout.id }
}
