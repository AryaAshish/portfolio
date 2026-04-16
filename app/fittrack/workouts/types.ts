import type { ExerciseLog } from '@/lib/fittrack-supabase'

export type LogWorkoutResult =
  | { ok: true; workoutId: string }
  | { ok: false; code: string; message: string }

export type UpdateWorkoutResult =
  | { ok: true }
  | { ok: false; message: string }

export type SetPatch = {
  id?: string
  exercise_name: string
  set_number: number | null
  set_type: ExerciseLog['set_type']
  reps: number | null
  weight_kg: number | null
  duration_secs: number | null
  delete?: boolean
}
