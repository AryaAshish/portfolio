/**
 * FitTrack — Supabase data layer
 *
 * All reads and writes for the fittrack section of the app.
 * Uses a dedicated client so it doesn't conflict with the portfolio client.
 * RLS is disabled on the fittrack project — this is intentional (single-user app).
 */

import { createClient } from '@supabase/supabase-js'

const fittrackDb = createClient(
  process.env.NEXT_PUBLIC_FITTRACK_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_FITTRACK_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
)

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  name: string
  age: number
  height_cm: number
  current_weight_kg: number | null
  target_weight_kg: number | null
  goal: string | null
  daily_protein_target: number | null
  daily_calorie_target: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface WeightLog {
  id: string
  date: string
  weight_kg: number
  body_fat_pct: number | null
  notes: string | null
  created_at: string
}

export interface Meal {
  id: string
  date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout'
  items: string
  protein_g: number | null
  calories: number | null
  carbs_g: number | null
  fat_g: number | null
  image_url: string | null
  notes: string | null
  created_at: string
}

export interface Workout {
  id: string
  date: string
  type: 'push' | 'pull' | 'legs' | 'auxiliary' | 'cardio' | 'rest'
  duration_mins: number | null
  volume_kg: number | null
  calories_burned: number | null
  exercises: Record<string, unknown> | null
  notes: string | null
  motra_raw: Record<string, unknown> | null
  created_at: string
}

export interface HealthMarker {
  id: string
  date: string
  marker_name: string
  value: number
  unit: string
  status: 'normal' | 'borderline' | 'low' | 'high' | 'critical' | null
  notes: string | null
  created_at: string
}

export interface DailySummary {
  id: string
  date: string
  summary_text: string | null
  total_protein_g: number | null
  total_calories: number | null
  workout_done: boolean
  workout_type: string | null
  weight_kg: number | null
  created_at: string
}

export interface FoodLibraryItem {
  id: string
  name: string
  serving_size_g: number | null
  serving_unit: string | null
  protein_g: number | null
  calories: number | null
  carbs_g: number | null
  fat_g: number | null
  category: string | null
  notes: string | null
  created_at: string
}

export interface MealTemplateItem {
  qty: number
  food: string
  unit: string
}

export interface MealTemplate {
  id: string
  name: string
  meal_type: string | null
  items: MealTemplateItem[]
  total_protein_g: number | null
  total_calories: number | null
  total_carbs_g: number | null
  total_fat_g: number | null
  notes: string | null
  created_at: string
}

export interface ExerciseLog {
  id: string
  workout_id: string | null
  date: string
  exercise_name: string
  set_number: number | null
  set_type: 'warmup' | 'working' | 'dropset' | 'cardio' | null
  reps: number | null
  weight_kg: number | null
  duration_secs: number | null
  created_at: string
}

export interface MacroDay {
  date: string
  protein_g: number
  calories: number
  carbs_g: number
  fat_g: number
}

export interface ExerciseProgressPoint {
  date: string
  max_weight_kg: number
  max_reps: number
}

export interface CalendarDay {
  date: string
  workout_type: string | null
  workout_done: boolean
  total_protein_g: number | null
  total_calories: number | null
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function daysAgoStr(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

// ─────────────────────────────────────────────────────────────
// User Profile
// ─────────────────────────────────────────────────────────────

export async function getUserProfile(): Promise<UserProfile | null> {
  const { data, error } = await fittrackDb
    .from('user_profile')
    .select('*')
    .limit(1)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as UserProfile
}

// ─────────────────────────────────────────────────────────────
// Weight
// ─────────────────────────────────────────────────────────────

export async function getLatestWeight(): Promise<WeightLog | null> {
  const { data, error } = await fittrackDb
    .from('weight_logs')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as WeightLog
}

export async function getWeightTrend(days: number): Promise<WeightLog[]> {
  const { data, error } = await fittrackDb
    .from('weight_logs')
    .select('*')
    .gte('date', daysAgoStr(days))
    .order('date', { ascending: true })

  if (error) throw error
  return (data ?? []) as WeightLog[]
}

export async function upsertWeight(entry: {
  date: string
  weight_kg: number
  body_fat_pct?: number
  notes?: string
}): Promise<WeightLog> {
  const { data, error } = await fittrackDb
    .from('weight_logs')
    .upsert(entry, { onConflict: 'date' })
    .select()
    .single()

  if (error) throw error
  return data as WeightLog
}

// ─────────────────────────────────────────────────────────────
// Meals
// ─────────────────────────────────────────────────────────────

export async function getMealsForDate(date: string): Promise<Meal[]> {
  const { data, error } = await fittrackDb
    .from('meals')
    .select('*')
    .eq('date', date)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as Meal[]
}

export async function getTodayMacros(date: string): Promise<MacroDay> {
  const meals = await getMealsForDate(date)
  return meals.reduce(
    (acc, m) => ({
      date,
      protein_g: acc.protein_g + (m.protein_g ?? 0),
      calories:  acc.calories  + (m.calories  ?? 0),
      carbs_g:   acc.carbs_g   + (m.carbs_g   ?? 0),
      fat_g:     acc.fat_g     + (m.fat_g     ?? 0),
    }),
    { date, protein_g: 0, calories: 0, carbs_g: 0, fat_g: 0 }
  )
}

export async function getMacroTrend(days: number): Promise<MacroDay[]> {
  const { data, error } = await fittrackDb
    .from('meals')
    .select('date, protein_g, calories, carbs_g, fat_g')
    .gte('date', daysAgoStr(days))
    .order('date', { ascending: true })

  if (error) throw error

  const byDate = new Map<string, MacroDay>()
  for (const m of data ?? []) {
    const prev = byDate.get(m.date) ?? { date: m.date, protein_g: 0, calories: 0, carbs_g: 0, fat_g: 0 }
    byDate.set(m.date, {
      date:      m.date,
      protein_g: prev.protein_g + (m.protein_g ?? 0),
      calories:  prev.calories  + (m.calories  ?? 0),
      carbs_g:   prev.carbs_g   + (m.carbs_g   ?? 0),
      fat_g:     prev.fat_g     + (m.fat_g     ?? 0),
    })
  }

  return Array.from(byDate.values())
}

export async function saveMeal(
  entry: Omit<Meal, 'id' | 'created_at'>
): Promise<Meal> {
  const { data, error } = await fittrackDb
    .from('meals')
    .insert(entry)
    .select()
    .single()

  if (error) throw error
  return data as Meal
}

// ─────────────────────────────────────────────────────────────
// Workouts
// ─────────────────────────────────────────────────────────────

export async function getAllWorkouts(limit = 50): Promise<Workout[]> {
  const { data, error } = await fittrackDb
    .from('workouts')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as Workout[]
}

export async function getWorkoutForDate(date: string): Promise<Workout | null> {
  const { data, error } = await fittrackDb
    .from('workouts')
    .select('*')
    .eq('date', date)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as Workout
}

export async function getLastWorkoutOfType(
  type: string,
  limit = 1
): Promise<Workout[]> {
  const { data, error } = await fittrackDb
    .from('workouts')
    .select('*')
    .eq('type', type)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as Workout[]
}

/**
 * Returns one row per calendar day that has a workout logged.
 * Fetches an entire month efficiently.
 */
export async function getWorkoutsForCalendar(
  year: number,
  month: number
): Promise<Pick<Workout, 'date' | 'type' | 'duration_mins' | 'volume_kg' | 'calories_burned'>[]> {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end   = new Date(year, month, 0).toISOString().split('T')[0] // last day of month

  const { data, error } = await fittrackDb
    .from('workouts')
    .select('date, type, duration_mins, volume_kg, calories_burned')
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function saveWorkout(
  entry: Omit<Workout, 'id' | 'created_at'>
): Promise<Workout> {
  const { data, error } = await fittrackDb
    .from('workouts')
    .insert(entry)
    .select()
    .single()

  if (error) throw error
  return data as Workout
}

// ─────────────────────────────────────────────────────────────
// Exercise Logs
// ─────────────────────────────────────────────────────────────

export async function getExerciseProgress(
  exerciseName: string
): Promise<ExerciseProgressPoint[]> {
  const { data, error } = await fittrackDb
    .from('exercise_logs')
    .select('date, weight_kg, reps, set_type')
    .eq('exercise_name', exerciseName)
    .in('set_type', ['working', 'dropset'])
    .not('weight_kg', 'is', null)
    .order('date', { ascending: true })

  if (error) throw error

  // Max weight + reps at max weight per date
  const byDate = new Map<string, ExerciseProgressPoint>()
  for (const log of data ?? []) {
    const prev = byDate.get(log.date)
    if (!prev || (log.weight_kg ?? 0) > prev.max_weight_kg) {
      byDate.set(log.date, {
        date: log.date,
        max_weight_kg: log.weight_kg ?? 0,
        max_reps: log.reps ?? 0,
      })
    }
  }

  return Array.from(byDate.values())
}

export async function getDistinctExerciseNames(): Promise<string[]> {
  const { data, error } = await fittrackDb
    .from('exercise_logs')
    .select('exercise_name')
    .order('exercise_name', { ascending: true })

  if (error) throw error

  const names = [...new Set((data ?? []).map((r: { exercise_name: string }) => r.exercise_name))]
  return names
}

export async function bulkInsertExerciseLogs(
  logs: Omit<ExerciseLog, 'id' | 'created_at'>[]
): Promise<void> {
  if (logs.length === 0) return
  const { error } = await fittrackDb.from('exercise_logs').insert(logs)
  if (error) throw error
}

// ─────────────────────────────────────────────────────────────
// Health Markers
// ─────────────────────────────────────────────────────────────

export async function getHealthMarkers(): Promise<HealthMarker[]> {
  const { data, error } = await fittrackDb
    .from('health_markers')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return (data ?? []) as HealthMarker[]
}

// ─────────────────────────────────────────────────────────────
// Food Library
// ─────────────────────────────────────────────────────────────

export async function getFoodLibrary(opts?: {
  search?: string
  category?: string
}): Promise<FoodLibraryItem[]> {
  let query = fittrackDb
    .from('food_library')
    .select('*')
    .order('name', { ascending: true })

  if (opts?.category) {
    query = query.eq('category', opts.category)
  }
  if (opts?.search) {
    query = query.ilike('name', `%${opts.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as FoodLibraryItem[]
}

export async function getFoodCategories(): Promise<string[]> {
  const { data, error } = await fittrackDb
    .from('food_library')
    .select('category')
    .order('category', { ascending: true })

  if (error) throw error
  const cats = [...new Set((data ?? []).map((r: { category: string | null }) => r.category).filter(Boolean))]
  return cats as string[]
}

export async function addFoodLibraryItem(
  item: Omit<FoodLibraryItem, 'id' | 'created_at'>
): Promise<FoodLibraryItem> {
  const { data, error } = await fittrackDb
    .from('food_library')
    .insert(item)
    .select()
    .single()

  if (error) throw error
  return data as FoodLibraryItem
}

// ─────────────────────────────────────────────────────────────
// Meal Templates
// ─────────────────────────────────────────────────────────────

export async function getMealTemplates(): Promise<MealTemplate[]> {
  const { data, error } = await fittrackDb
    .from('meal_templates')
    .select('*')
    .order('meal_type', { ascending: true })

  if (error) throw error
  return (data ?? []) as MealTemplate[]
}

export async function getMealTemplateById(id: string): Promise<MealTemplate | null> {
  const { data, error } = await fittrackDb
    .from('meal_templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as MealTemplate
}

// ─────────────────────────────────────────────────────────────
// Daily Summaries
// ─────────────────────────────────────────────────────────────

export async function getDailySummary(date: string): Promise<DailySummary | null> {
  const { data, error } = await fittrackDb
    .from('daily_summaries')
    .select('*')
    .eq('date', date)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as DailySummary
}

export async function getRecentSummaries(days: number): Promise<DailySummary[]> {
  const { data, error } = await fittrackDb
    .from('daily_summaries')
    .select('*')
    .gte('date', daysAgoStr(days))
    .order('date', { ascending: false })

  if (error) throw error
  return (data ?? []) as DailySummary[]
}
