/**
 * FitTrack — Supabase data layer
 *
 * All reads and writes for the fittrack section of the app.
 * Uses a dedicated client so it doesn't conflict with the portfolio client.
 * RLS is disabled on the fittrack project — this is intentional (single-user app).
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let fittrackClient: SupabaseClient | null = null

function getFittrackDb(): SupabaseClient {
  if (!fittrackClient) {
    const url = process.env.NEXT_PUBLIC_FITTRACK_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_FITTRACK_SUPABASE_KEY
    if (!url || !key) {
      throw new Error(
        'NEXT_PUBLIC_FITTRACK_SUPABASE_URL and NEXT_PUBLIC_FITTRACK_SUPABASE_KEY are required for FitTrack'
      )
    }
    fittrackClient = createClient(url, key, { auth: { persistSession: false } })
  }
  return fittrackClient
}

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
  weekly_gym_target: number
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
  title: string | null
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
  const { data, error } = await getFittrackDb()
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
  const { data, error } = await getFittrackDb()
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
  const { data, error } = await getFittrackDb()
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
  const { data, error } = await getFittrackDb()
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
  const { data, error } = await getFittrackDb()
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
  const { data, error } = await getFittrackDb()
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
  const { data, error } = await getFittrackDb()
    .from('meals')
    .insert(entry)
    .select()
    .single()

  if (error) throw error
  return data as Meal
}

export async function updateMeal(
  id: string,
  updates: Partial<Omit<Meal, 'id' | 'created_at'>>
): Promise<Meal> {
  const { data, error } = await getFittrackDb()
    .from('meals')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Meal
}

export async function deleteMeal(id: string): Promise<void> {
  const { error } = await getFittrackDb().from('meals').delete().eq('id', id)
  if (error) throw error
}

// ─────────────────────────────────────────────────────────────
// Workouts
// ─────────────────────────────────────────────────────────────

export async function getAllWorkouts(limit = 50): Promise<Workout[]> {
  const { data, error } = await getFittrackDb()
    .from('workouts')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as Workout[]
}

export async function getWorkoutsFromDate(fromDate: string): Promise<Workout[]> {
  const { data, error } = await getFittrackDb()
    .from('workouts')
    .select('*')
    .gte('date', fromDate)
    .order('date', { ascending: false })

  if (error) throw error
  return (data ?? []) as Workout[]
}

export async function deleteWorkoutById(id: string): Promise<void> {
  const { error } = await getFittrackDb().from('workouts').delete().eq('id', id)
  if (error) throw error
}

export async function getWorkoutForDate(date: string): Promise<Workout | null> {
  const { data, error } = await getFittrackDb()
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

export async function getWorkoutById(id: string): Promise<Workout | null> {
  const { data, error } = await getFittrackDb()
    .from('workouts')
    .select('*')
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as Workout
}

export async function getAllWorkoutsForDate(date: string): Promise<Workout[]> {
  const { data, error } = await getFittrackDb()
    .from('workouts')
    .select('*')
    .eq('date', date)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Workout[]
}

export async function getLastWorkoutOfType(
  type: string,
  limit = 1
): Promise<Workout[]> {
  const { data, error } = await getFittrackDb()
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
): Promise<Pick<Workout, 'date' | 'type' | 'title' | 'duration_mins' | 'volume_kg' | 'calories_burned'>[]> {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end   = new Date(year, month, 0).toISOString().split('T')[0]

  const { data, error } = await getFittrackDb()
    .from('workouts')
    .select('date, type, title, duration_mins, volume_kg, calories_burned')
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getWorkoutsForWeek(
  mondayDate: string
): Promise<Pick<Workout, 'date' | 'type' | 'title'>[]> {
  const mon = new Date(mondayDate + 'T00:00:00')
  const sun = new Date(mon)
  sun.setDate(sun.getDate() + 6)
  const sundayDate = sun.toISOString().split('T')[0]

  const { data, error } = await getFittrackDb()
    .from('workouts')
    .select('date, type, title')
    .gte('date', mondayDate)
    .lte('date', sundayDate)
    .order('date', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function saveWorkout(
  entry: Omit<Workout, 'id' | 'created_at'>
): Promise<Workout> {
  const { data, error } = await getFittrackDb()
    .from('workouts')
    .insert(entry)
    .select()
    .single()

  if (error) throw error
  return data as Workout
}

export async function updateWorkout(
  id: string,
  patch: Partial<Pick<Workout, 'type' | 'title' | 'notes'>>
): Promise<void> {
  const { error } = await getFittrackDb()
    .from('workouts')
    .update(patch)
    .eq('id', id)
  if (error) throw error
}

// ─────────────────────────────────────────────────────────────
// Exercise Logs
// ─────────────────────────────────────────────────────────────

export async function getExerciseLogsForWorkout(
  workoutId: string
): Promise<ExerciseLog[]> {
  const { data, error } = await getFittrackDb()
    .from('exercise_logs')
    .select('*')
    .eq('workout_id', workoutId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as ExerciseLog[]
}

export type ExerciseComparison = {
  exerciseName: string
  prevDate: string | null
  prevSets: { reps: number | null; weight_kg: number | null; set_type: string | null }[]
  prevMaxWeight: number | null
  currentMaxWeight: number | null
  deltaPercent: number | null
}

export async function getExerciseComparisons(
  exerciseNames: string[],
  currentDate: string
): Promise<ExerciseComparison[]> {
  if (exerciseNames.length === 0) return []

  const results: ExerciseComparison[] = []

  for (const name of exerciseNames) {
    const { data: prevLogs, error } = await getFittrackDb()
      .from('exercise_logs')
      .select('date, reps, weight_kg, set_type')
      .eq('exercise_name', name)
      .lt('date', currentDate)
      .order('date', { ascending: false })
      .limit(20)

    if (error) continue

    const prevDate = prevLogs?.[0]?.date ?? null
    const prevSets = prevDate
      ? (prevLogs ?? []).filter((l: { date: string }) => l.date === prevDate)
      : []
    const prevMaxWeight = prevSets.length > 0
      ? Math.max(...prevSets.map((s: { weight_kg: number | null }) => Number(s.weight_kg ?? 0)))
      : null

    const { data: currentLogs } = await getFittrackDb()
      .from('exercise_logs')
      .select('weight_kg')
      .eq('exercise_name', name)
      .eq('date', currentDate)
      .not('weight_kg', 'is', null)

    const currentMaxWeight = currentLogs && currentLogs.length > 0
      ? Math.max(...currentLogs.map((s: { weight_kg: number | null }) => Number(s.weight_kg ?? 0)))
      : null

    const deltaPercent =
      prevMaxWeight && currentMaxWeight && prevMaxWeight > 0
        ? Math.round(((currentMaxWeight - prevMaxWeight) / prevMaxWeight) * 100)
        : null

    results.push({
      exerciseName: name,
      prevDate,
      prevSets: prevSets.map((s: { reps: number | null; weight_kg: number | null; set_type: string | null }) => ({
        reps: s.reps,
        weight_kg: s.weight_kg,
        set_type: s.set_type,
      })),
      prevMaxWeight,
      currentMaxWeight,
      deltaPercent,
    })
  }

  return results
}

export async function getExerciseProgress(
  exerciseName: string
): Promise<ExerciseProgressPoint[]> {
  const { data, error } = await getFittrackDb()
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

export type ExerciseSession = {
  date: string
  sets: { set_number: number | null; set_type: string | null; reps: number | null; weight_kg: number | null; duration_secs: number | null }[]
}

export async function getExerciseSessionHistory(
  exerciseName: string
): Promise<ExerciseSession[]> {
  const { data, error } = await getFittrackDb()
    .from('exercise_logs')
    .select('date, set_number, set_type, reps, weight_kg, duration_secs')
    .eq('exercise_name', exerciseName)
    .order('date', { ascending: false })
    .order('set_number', { ascending: true })

  if (error) throw error

  const byDate = new Map<string, ExerciseSession>()
  for (const row of data ?? []) {
    let session = byDate.get(row.date)
    if (!session) {
      session = { date: row.date, sets: [] }
      byDate.set(row.date, session)
    }
    session.sets.push({
      set_number: row.set_number,
      set_type: row.set_type,
      reps: row.reps,
      weight_kg: row.weight_kg,
      duration_secs: row.duration_secs,
    })
  }

  return Array.from(byDate.values())
}

export async function getDistinctExerciseNames(): Promise<string[]> {
  const { data, error } = await getFittrackDb()
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
  const { error } = await getFittrackDb().from('exercise_logs').insert(logs)
  if (error) throw error
}

export async function insertExerciseLog(
  log: Omit<ExerciseLog, 'id' | 'created_at'>
): Promise<ExerciseLog> {
  const { data, error } = await getFittrackDb()
    .from('exercise_logs')
    .insert(log)
    .select()
    .single()
  if (error) throw error
  return data as ExerciseLog
}

export async function updateExerciseLog(
  id: string,
  patch: Partial<Pick<ExerciseLog, 'reps' | 'weight_kg' | 'set_type' | 'duration_secs' | 'set_number' | 'exercise_name'>>
): Promise<void> {
  const { error } = await getFittrackDb()
    .from('exercise_logs')
    .update(patch)
    .eq('id', id)
  if (error) throw error
}

export async function deleteExerciseLog(id: string): Promise<void> {
  const { error } = await getFittrackDb()
    .from('exercise_logs')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export type SuggestedExercise = {
  name: string
  lastDate: string
  lastMaxWeight: number | null
  lastMaxReps: number | null
}

function parseExerciseNamesFromTitle(title: string): string[] {
  const parts = title.split(',').map((p) => p.trim()).filter(Boolean)
  return parts
    .map((p) =>
      p
        .replace(/\s+\d+(\.\d+)?\s*kg.*$/i, '')
        .replace(/\s+assist(ed)?$/i, '')
        .replace(/\s+warmup$/i, '')
        .trim()
    )
    .filter((p) => p.length > 2)
}

export async function getExercisesForWorkoutType(
  type: string
): Promise<SuggestedExercise[]> {
  const { data: workouts, error: wErr } = await getFittrackDb()
    .from('workouts')
    .select('id, date, title')
    .eq('type', type)
    .order('date', { ascending: false })

  if (wErr) throw wErr
  const typeWorkouts = workouts ?? []
  if (typeWorkouts.length === 0) return []

  const ids = typeWorkouts.map((w: { id: string }) => w.id)

  const { data: logs, error: lErr } = await getFittrackDb()
    .from('exercise_logs')
    .select('exercise_name, date, weight_kg, reps')
    .in('workout_id', ids)
    .in('set_type', ['working', 'dropset'])
    .order('date', { ascending: false })

  if (lErr) throw lErr

  const byName = new Map<string, SuggestedExercise>()
  for (const log of logs ?? []) {
    if (byName.has(log.exercise_name)) {
      const existing = byName.get(log.exercise_name)!
      if (log.date === existing.lastDate && (log.weight_kg ?? 0) > (existing.lastMaxWeight ?? 0)) {
        existing.lastMaxWeight = log.weight_kg
        existing.lastMaxReps = log.reps
      }
      continue
    }
    byName.set(log.exercise_name, {
      name: log.exercise_name,
      lastDate: log.date,
      lastMaxWeight: log.weight_kg,
      lastMaxReps: log.reps,
    })
  }

  if (byName.size === 0) {
    for (const w of typeWorkouts as { date: string; title: string | null }[]) {
      if (!w.title) continue
      for (const name of parseExerciseNamesFromTitle(w.title)) {
        if (byName.has(name)) continue
        byName.set(name, {
          name,
          lastDate: w.date,
          lastMaxWeight: null,
          lastMaxReps: null,
        })
      }
    }
  }

  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export async function getWeeklyGymStreak(): Promise<
  import('./fittrack/weekly-streak').WeeklyStreakResult
> {
  const { computeWeeklyStreak } = await import('./fittrack/weekly-streak')
  const today = new Date().toISOString().slice(0, 10)

  const profile = await getUserProfile()
  const target = profile?.weekly_gym_target ?? 3

  const { data, error } = await getFittrackDb()
    .from('workouts')
    .select('date, type')
    .gte('date', shiftISODate(today, -365))
    .order('date', { ascending: false })

  if (error) throw error

  const rows = (data ?? []) as { date: string; type: import('./fittrack/weekly-streak').StreakWorkoutType }[]
  return computeWeeklyStreak(rows, target, today)
}

function shiftISODate(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export async function updateWeeklyGymTarget(target: number): Promise<void> {
  const safe = Math.max(0, Math.floor(target))
  const profile = await getUserProfile()
  if (!profile) throw new Error('No user profile found')
  const { error } = await getFittrackDb()
    .from('user_profile')
    .update({ weekly_gym_target: safe })
    .eq('id', profile.id)
  if (error) throw error
}

// ─────────────────────────────────────────────────────────────
// Health Markers
// ─────────────────────────────────────────────────────────────

export async function getHealthMarkers(): Promise<HealthMarker[]> {
  const { data, error } = await getFittrackDb()
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
  let query = getFittrackDb()
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
  const { data, error } = await getFittrackDb()
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
  const { data, error } = await getFittrackDb()
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
  const { data, error } = await getFittrackDb()
    .from('meal_templates')
    .select('*')
    .order('meal_type', { ascending: true })

  if (error) throw error
  return (data ?? []) as MealTemplate[]
}

export async function getMealTemplateById(id: string): Promise<MealTemplate | null> {
  const { data, error } = await getFittrackDb()
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
  const { data, error } = await getFittrackDb()
    .from('daily_summaries')
    .select('*')
    .eq('date', date)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as DailySummary
}

export async function getRecentSummaries(days: number): Promise<DailySummary[]> {
  const { data, error } = await getFittrackDb()
    .from('daily_summaries')
    .select('*')
    .gte('date', daysAgoStr(days))
    .order('date', { ascending: false })

  if (error) throw error
  return (data ?? []) as DailySummary[]
}
