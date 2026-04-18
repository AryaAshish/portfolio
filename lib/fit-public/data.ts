import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  UserProfile,
  WeightLog,
  Meal,
  MealComponent,
  Workout,
  ExerciseLog,
  HealthMarker,
  FoodLibraryItem,
  MealTemplate,
  PlanPhaseRow,
  MacroDay,
  ExerciseProgressPoint,
  ExerciseSession,
  SuggestedExercise,
  ExerciseComparison,
} from '@/lib/fittrack-supabase'
import { MEAL_COMPONENT_SCHEMA_VERSION } from '@/lib/fittrack-supabase'
import { componentsToText, sumComponents } from '@/lib/fittrack/macro-compute'

type Client = SupabaseClient<any, any, any>

async function requireUserId(client: Client): Promise<string> {
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return user.id
}

function daysAgoStr(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

function shiftISODate(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function stampComponents(components: MealComponent[]): MealComponent[] {
  return components.map((c) =>
    c.schema_version ? c : { ...c, schema_version: MEAL_COMPONENT_SCHEMA_VERSION }
  )
}

// ── User Profile ───────────────────────────────────────────
export async function getUserProfile(client: Client): Promise<UserProfile | null> {
  const uid = await requireUserId(client)
  const { data, error } = await client
    .from('user_profile').select('*').eq('user_id', uid).limit(1).single()
  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as UserProfile
}

// ── Weight ─────────────────────────────────────────────────
export async function getLatestWeight(client: Client): Promise<WeightLog | null> {
  const { data, error } = await client
    .from('weight_logs').select('*').order('date', { ascending: false }).limit(1).single()
  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as WeightLog
}

export async function getWeightTrend(client: Client, days: number): Promise<WeightLog[]> {
  const { data, error } = await client
    .from('weight_logs').select('*').gte('date', daysAgoStr(days)).order('date', { ascending: true })
  if (error) throw error
  return (data ?? []) as WeightLog[]
}

export async function upsertWeight(client: Client, entry: {
  date: string; weight_kg: number; body_fat_pct?: number; notes?: string
}): Promise<WeightLog> {
  const uid = await requireUserId(client)
  const { data, error } = await client
    .from('weight_logs').upsert({ ...entry, user_id: uid }, { onConflict: 'user_id,date' }).select().single()
  if (error) throw error
  return data as WeightLog
}

// ── Meals ──────────────────────────────────────────────────
export async function getMealsForDate(client: Client, date: string): Promise<Meal[]> {
  const { data, error } = await client
    .from('meals').select('*').eq('date', date).order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as Meal[]
}

export async function getTodayMacros(client: Client, date: string): Promise<MacroDay> {
  const meals = await getMealsForDate(client, date)
  return meals.reduce(
    (acc, m) => ({
      date,
      protein_g: acc.protein_g + (m.protein_g ?? 0),
      calories: acc.calories + (m.calories ?? 0),
      carbs_g: acc.carbs_g + (m.carbs_g ?? 0),
      fat_g: acc.fat_g + (m.fat_g ?? 0),
    }),
    { date, protein_g: 0, calories: 0, carbs_g: 0, fat_g: 0 }
  )
}

export async function saveMeal(client: Client, entry: Omit<Meal, 'id' | 'created_at'>): Promise<Meal> {
  const uid = await requireUserId(client)
  const { data, error } = await client.from('meals').insert({ ...entry, user_id: uid }).select().single()
  if (error) throw error
  return data as Meal
}

export async function addMealWithComponents(client: Client, entry: {
  date: string; meal_type: Meal['meal_type']; components: MealComponent[]; notes?: string | null
}): Promise<Meal> {
  const uid = await requireUserId(client)
  const versioned = stampComponents(entry.components)
  const totals = sumComponents(versioned)
  const items = componentsToText(versioned) || '-'
  const { data, error } = await client.from('meals').insert({
    date: entry.date, meal_type: entry.meal_type, items,
    protein_g: totals.protein_g, calories: totals.calories,
    carbs_g: totals.carbs_g, fat_g: totals.fat_g,
    image_url: null, notes: entry.notes ?? null,
    components: versioned, user_id: uid,
  }).select().single()
  if (error) throw error
  return data as Meal
}

export async function updateMeal(client: Client, id: string, updates: Partial<Omit<Meal, 'id' | 'created_at'>>): Promise<Meal> {
  const { data, error } = await client.from('meals').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as Meal
}

export async function deleteMeal(client: Client, id: string): Promise<void> {
  const { error } = await client.from('meals').delete().eq('id', id)
  if (error) throw error
}

// ── Workouts ───────────────────────────────────────────────
export async function getAllWorkouts(client: Client, limit = 50): Promise<Workout[]> {
  const { data, error } = await client
    .from('workouts').select('*').order('date', { ascending: false }).limit(limit)
  if (error) throw error
  return (data ?? []) as Workout[]
}

export async function getWorkoutsFromDate(client: Client, fromDate: string): Promise<Workout[]> {
  const { data, error } = await client
    .from('workouts').select('*').gte('date', fromDate).order('date', { ascending: false })
  if (error) throw error
  return (data ?? []) as Workout[]
}

export async function getWorkoutForDate(client: Client, date: string): Promise<Workout | null> {
  const { data, error } = await client
    .from('workouts').select('*').eq('date', date).order('created_at', { ascending: false }).limit(1).single()
  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as Workout
}

export async function getWorkoutById(client: Client, id: string): Promise<Workout | null> {
  const { data, error } = await client.from('workouts').select('*').eq('id', id).single()
  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as Workout
}

export async function getAllWorkoutsForDate(client: Client, date: string): Promise<Workout[]> {
  const { data, error } = await client
    .from('workouts').select('*').eq('date', date).order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Workout[]
}

export async function saveWorkout(client: Client, entry: Omit<Workout, 'id' | 'created_at'>): Promise<Workout> {
  const uid = await requireUserId(client)
  const { data, error } = await client.from('workouts').insert({ ...entry, user_id: uid }).select().single()
  if (error) throw error
  return data as Workout
}

export async function updateWorkout(client: Client, id: string, patch: Partial<Pick<Workout, 'type' | 'title' | 'notes'>>): Promise<void> {
  const { error } = await client.from('workouts').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteWorkoutById(client: Client, id: string): Promise<void> {
  const { error } = await client.from('workouts').delete().eq('id', id)
  if (error) throw error
}

export async function getWorkoutsForCalendar(client: Client, year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const end = new Date(year, month, 0).toISOString().split('T')[0]
  const { data, error } = await client
    .from('workouts').select('date, type, title, duration_mins, volume_kg, calories_burned')
    .gte('date', start).lte('date', end).order('date', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getWorkoutsForWeek(client: Client, mondayDate: string) {
  const mon = new Date(mondayDate + 'T00:00:00')
  const sun = new Date(mon)
  sun.setDate(sun.getDate() + 6)
  const sundayDate = sun.toISOString().split('T')[0]
  const { data, error } = await client
    .from('workouts').select('date, type, title')
    .gte('date', mondayDate).lte('date', sundayDate).order('date', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getLastWorkoutOfType(client: Client, type: string, limit = 1): Promise<Workout[]> {
  const { data, error } = await client
    .from('workouts').select('*').eq('type', type).order('date', { ascending: false }).limit(limit)
  if (error) throw error
  return (data ?? []) as Workout[]
}

// ── Exercise Logs ──────────────────────────────────────────
export async function getExerciseLogsForWorkout(client: Client, workoutId: string): Promise<ExerciseLog[]> {
  const { data, error } = await client
    .from('exercise_logs').select('*').eq('workout_id', workoutId).order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as ExerciseLog[]
}

export async function bulkInsertExerciseLogs(client: Client, logs: Omit<ExerciseLog, 'id' | 'created_at'>[]): Promise<void> {
  if (logs.length === 0) return
  const uid = await requireUserId(client)
  const withUid = logs.map((l) => ({ ...l, user_id: uid }))
  const { error } = await client.from('exercise_logs').insert(withUid)
  if (error) throw error
}

export async function insertExerciseLog(client: Client, log: Omit<ExerciseLog, 'id' | 'created_at'>): Promise<ExerciseLog> {
  const uid = await requireUserId(client)
  const { data, error } = await client.from('exercise_logs').insert({ ...log, user_id: uid }).select().single()
  if (error) throw error
  return data as ExerciseLog
}

export async function updateExerciseLog(client: Client, id: string, patch: Partial<Pick<ExerciseLog, 'reps' | 'weight_kg' | 'set_type' | 'duration_secs' | 'set_number' | 'exercise_name'>>): Promise<void> {
  const { error } = await client.from('exercise_logs').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteExerciseLog(client: Client, id: string): Promise<void> {
  const { error } = await client.from('exercise_logs').delete().eq('id', id)
  if (error) throw error
}

export async function getDistinctExerciseNames(client: Client): Promise<string[]> {
  const { data, error } = await client
    .from('exercise_logs').select('exercise_name').order('exercise_name', { ascending: true })
  if (error) throw error
  return [...new Set((data ?? []).map((r: { exercise_name: string }) => r.exercise_name))]
}

export async function getExerciseProgress(client: Client, exerciseName: string): Promise<ExerciseProgressPoint[]> {
  const { data, error } = await client
    .from('exercise_logs').select('date, weight_kg, reps, set_type')
    .eq('exercise_name', exerciseName).in('set_type', ['working', 'dropset'])
    .not('weight_kg', 'is', null).order('date', { ascending: true })
  if (error) throw error
  const byDate = new Map<string, ExerciseProgressPoint>()
  for (const log of data ?? []) {
    const prev = byDate.get(log.date)
    if (!prev || (log.weight_kg ?? 0) > prev.max_weight_kg) {
      byDate.set(log.date, { date: log.date, max_weight_kg: log.weight_kg ?? 0, max_reps: log.reps ?? 0 })
    }
  }
  return Array.from(byDate.values())
}

export async function getExerciseSessionHistory(client: Client, exerciseName: string): Promise<ExerciseSession[]> {
  const { data, error } = await client
    .from('exercise_logs').select('date, set_number, set_type, reps, weight_kg, duration_secs')
    .eq('exercise_name', exerciseName)
    .order('date', { ascending: false }).order('set_number', { ascending: true })
  if (error) throw error
  const byDate = new Map<string, ExerciseSession>()
  for (const row of data ?? []) {
    let session = byDate.get(row.date)
    if (!session) { session = { date: row.date, sets: [] }; byDate.set(row.date, session) }
    session.sets.push({ set_number: row.set_number, set_type: row.set_type, reps: row.reps, weight_kg: row.weight_kg, duration_secs: row.duration_secs })
  }
  return Array.from(byDate.values())
}

export async function getExerciseComparisons(client: Client, exerciseNames: string[], currentDate: string): Promise<ExerciseComparison[]> {
  if (exerciseNames.length === 0) return []
  const results: ExerciseComparison[] = []
  for (const name of exerciseNames) {
    const { data: prevLogs, error } = await client
      .from('exercise_logs').select('date, reps, weight_kg, set_type')
      .eq('exercise_name', name).lt('date', currentDate)
      .order('date', { ascending: false }).limit(20)
    if (error) continue
    const prevDate = prevLogs?.[0]?.date ?? null
    const prevSets = prevDate ? (prevLogs ?? []).filter((l: any) => l.date === prevDate) : []
    const prevMaxWeight = prevSets.length > 0 ? Math.max(...prevSets.map((s: any) => Number(s.weight_kg ?? 0))) : null
    const { data: currentLogs } = await client
      .from('exercise_logs').select('weight_kg')
      .eq('exercise_name', name).eq('date', currentDate).not('weight_kg', 'is', null)
    const currentMaxWeight = currentLogs && currentLogs.length > 0
      ? Math.max(...currentLogs.map((s: any) => Number(s.weight_kg ?? 0))) : null
    const deltaPercent = prevMaxWeight && currentMaxWeight && prevMaxWeight > 0
      ? Math.round(((currentMaxWeight - prevMaxWeight) / prevMaxWeight) * 100) : null
    results.push({
      exerciseName: name, prevDate,
      prevSets: prevSets.map((s: any) => ({ reps: s.reps, weight_kg: s.weight_kg, set_type: s.set_type })),
      prevMaxWeight, currentMaxWeight, deltaPercent,
    })
  }
  return results
}

export async function getExercisesForWorkoutType(client: Client, type: string): Promise<SuggestedExercise[]> {
  const { data: workouts, error: wErr } = await client
    .from('workouts').select('id, date, title').eq('type', type).order('date', { ascending: false })
  if (wErr) throw wErr
  const typeWorkouts = workouts ?? []
  if (typeWorkouts.length === 0) return []
  const ids = typeWorkouts.map((w: any) => w.id)
  const { data: logs, error: lErr } = await client
    .from('exercise_logs').select('exercise_name, date, weight_kg, reps')
    .in('workout_id', ids).in('set_type', ['working', 'dropset']).order('date', { ascending: false })
  if (lErr) throw lErr
  const byName = new Map<string, SuggestedExercise>()
  for (const log of logs ?? []) {
    if (byName.has(log.exercise_name)) {
      const existing = byName.get(log.exercise_name)!
      if (log.date === existing.lastDate && (log.weight_kg ?? 0) > (existing.lastMaxWeight ?? 0)) {
        existing.lastMaxWeight = log.weight_kg; existing.lastMaxReps = log.reps
      }
      continue
    }
    byName.set(log.exercise_name, { name: log.exercise_name, lastDate: log.date, lastMaxWeight: log.weight_kg, lastMaxReps: log.reps })
  }
  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name))
}

// ── Food Library (shared, no user_id) ──────────────────────
export async function getFoodLibrary(client: Client, opts?: { search?: string; category?: string }): Promise<FoodLibraryItem[]> {
  let query = client.from('food_library').select('*').order('name', { ascending: true })
  if (opts?.category) query = query.eq('category', opts.category)
  if (opts?.search) query = query.ilike('name', `%${opts.search}%`)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as FoodLibraryItem[]
}

export async function getFoodCategories(client: Client): Promise<string[]> {
  const { data, error } = await client.from('food_library').select('category').order('category', { ascending: true })
  if (error) throw error
  return [...new Set((data ?? []).map((r: any) => r.category).filter(Boolean))] as string[]
}

// ── Meal Templates (per-user, RLS) ─────────────────────────
export async function getMealTemplates(client: Client): Promise<MealTemplate[]> {
  const { data, error } = await client.from('meal_templates').select('*').order('meal_type', { ascending: true })
  if (error) throw error
  return (data ?? []) as MealTemplate[]
}

export async function getMealTemplateById(client: Client, id: string): Promise<MealTemplate | null> {
  const { data, error } = await client.from('meal_templates').select('*').eq('id', id).single()
  if (error?.code === 'PGRST116') return null
  if (error) throw error
  return data as MealTemplate
}

export async function saveMealAsTemplate(client: Client, entry: {
  name: string; meal_type: Meal['meal_type'] | null; components: MealComponent[]
}): Promise<MealTemplate> {
  const uid = await requireUserId(client)
  const versioned = stampComponents(entry.components)
  const totals = sumComponents(versioned)
  const items = versioned.map((c) => ({ qty: c.qty, food: c.food_name, unit: c.unit }))
  const { data, error } = await client.from('meal_templates').insert({
    name: entry.name, meal_type: entry.meal_type, items,
    total_protein_g: totals.protein_g, total_calories: totals.calories,
    total_carbs_g: totals.carbs_g, total_fat_g: totals.fat_g,
    notes: null, user_id: uid,
  }).select().single()
  if (error) throw error
  return data as MealTemplate
}

// ── Plan Phases ────────────────────────────────────────────
export async function getPlanPhases(client: Client): Promise<PlanPhaseRow[]> {
  const { data, error } = await client.from('plan_phases').select('*').order('phase_number', { ascending: true })
  if (error) throw error
  return (data ?? []) as PlanPhaseRow[]
}

export async function replacePlanPhases(client: Client, phases: Array<Omit<PlanPhaseRow, 'id' | 'created_at'>>): Promise<void> {
  const uid = await requireUserId(client)
  const { error: delErr } = await client.from('plan_phases').delete().neq('phase_number', -1)
  if (delErr) throw delErr
  if (phases.length === 0) return
  const withUid = phases.map((p) => ({ ...p, user_id: uid }))
  const { error: insErr } = await client.from('plan_phases').insert(withUid)
  if (insErr) throw insErr
}

// ── Health Markers ─────────────────────────────────────────
export async function getHealthMarkers(client: Client): Promise<HealthMarker[]> {
  const { data, error } = await client.from('health_markers').select('*').order('date', { ascending: false })
  if (error) throw error
  return (data ?? []) as HealthMarker[]
}

// ── Weekly Streak ──────────────────────────────────────────
export async function getWeeklyGymStreak(client: Client) {
  const { computeWeeklyStreak } = await import('@/lib/fittrack/weekly-streak')
  const today = new Date().toISOString().slice(0, 10)
  const profile = await getUserProfile(client)
  const target = profile?.weekly_gym_target ?? 3
  const { data, error } = await client
    .from('workouts').select('date, type').gte('date', shiftISODate(today, -365)).order('date', { ascending: false })
  if (error) throw error
  const rows = (data ?? []) as { date: string; type: import('@/lib/fittrack/weekly-streak').StreakWorkoutType }[]
  return computeWeeklyStreak(rows, target, today)
}

export async function updateWeeklyGymTarget(client: Client, target: number): Promise<void> {
  const safe = Math.max(0, Math.floor(target))
  const profile = await getUserProfile(client)
  if (!profile) throw new Error('No user profile found')
  const { error } = await client.from('user_profile').update({ weekly_gym_target: safe }).eq('id', profile.id)
  if (error) throw error
}

// ── Macro Trend ────────────────────────────────────────────
export async function getMacroTrend(client: Client, days: number): Promise<MacroDay[]> {
  const { data, error } = await client
    .from('meals').select('date, protein_g, calories, carbs_g, fat_g')
    .gte('date', daysAgoStr(days)).order('date', { ascending: true })
  if (error) throw error
  const byDate = new Map<string, MacroDay>()
  for (const m of data ?? []) {
    const prev = byDate.get(m.date) ?? { date: m.date, protein_g: 0, calories: 0, carbs_g: 0, fat_g: 0 }
    byDate.set(m.date, {
      date: m.date,
      protein_g: prev.protein_g + (m.protein_g ?? 0),
      calories: prev.calories + (m.calories ?? 0),
      carbs_g: prev.carbs_g + (m.carbs_g ?? 0),
      fat_g: prev.fat_g + (m.fat_g ?? 0),
    })
  }
  return Array.from(byDate.values())
}

// ── Export ──────────────────────────────────────────────────
export async function fetchAllFitTrackRows(client: Client) {
  const [userProfile, weightLogs, workouts, exerciseLogs, meals, mealTemplates, healthMarkers, planPhases, foodLibrary] = await Promise.all([
    client.from('user_profile').select('*'),
    client.from('weight_logs').select('*').order('date', { ascending: true }),
    client.from('workouts').select('*').order('date', { ascending: true }),
    client.from('exercise_logs').select('*').order('date', { ascending: true }),
    client.from('meals').select('*').order('date', { ascending: true }),
    client.from('meal_templates').select('*').order('name', { ascending: true }),
    client.from('health_markers').select('*').order('date', { ascending: true }),
    client.from('plan_phases').select('*').order('phase_number', { ascending: true }),
    client.from('food_library').select('*').order('name', { ascending: true }),
  ])
  const first = [userProfile, weightLogs, workouts, exerciseLogs, meals, mealTemplates, healthMarkers, planPhases, foodLibrary].find((r) => r.error)
  if (first?.error) throw first.error
  return {
    user_profile: (userProfile.data ?? []) as unknown[],
    weight_logs: (weightLogs.data ?? []) as unknown[],
    workouts: (workouts.data ?? []) as unknown[],
    exercise_logs: (exerciseLogs.data ?? []) as unknown[],
    meals: (meals.data ?? []) as unknown[],
    meal_templates: (mealTemplates.data ?? []) as unknown[],
    health_markers: (healthMarkers.data ?? []) as unknown[],
    plan_phases: (planPhases.data ?? []) as unknown[],
    food_library: (foodLibrary.data ?? []) as unknown[],
  }
}
