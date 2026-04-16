import { parseMotraShareText } from '@/lib/fittrack/motra-parse'
import {
  bulkInsertExerciseLogs,
  deleteWorkoutById,
  saveWorkout,
  type Workout,
} from '@/lib/fittrack-supabase'

export async function ingestMotraWorkout(
  text: string,
  typeOverride?: Workout['type'] | null
): Promise<{ workoutId: string }> {
  const parsed = parseMotraShareText(text)
  if (parsed.exerciseLogs.length === 0) {
    throw new Error('No sets parsed from Motra text')
  }

  const workout = await saveWorkout({
    date: parsed.date,
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
    await bulkInsertExerciseLogs(logs)
  } catch (e) {
    await deleteWorkoutById(workout.id)
    throw e
  }

  return { workoutId: workout.id }
}
