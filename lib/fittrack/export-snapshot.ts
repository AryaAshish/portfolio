export const FITTRACK_EXPORT_SCHEMA_VERSION = 1

export type FitTrackExportRows = {
  user_profile: unknown[]
  weight_logs: unknown[]
  workouts: unknown[]
  exercise_logs: unknown[]
  meals: unknown[]
  meal_templates: unknown[]
  health_markers: unknown[]
  plan_phases: unknown[]
  food_library: unknown[]
}

export type FitTrackSnapshot = FitTrackExportRows & {
  exported_at: string
  schema_version: number
  row_counts: Record<keyof FitTrackExportRows, number>
}

export function composeSnapshot(
  rows: FitTrackExportRows,
  exportedAt: string
): FitTrackSnapshot {
  const row_counts: Record<keyof FitTrackExportRows, number> = {
    user_profile: rows.user_profile.length,
    weight_logs: rows.weight_logs.length,
    workouts: rows.workouts.length,
    exercise_logs: rows.exercise_logs.length,
    meals: rows.meals.length,
    meal_templates: rows.meal_templates.length,
    health_markers: rows.health_markers.length,
    plan_phases: rows.plan_phases.length,
    food_library: rows.food_library.length,
  }
  return {
    exported_at: exportedAt,
    schema_version: FITTRACK_EXPORT_SCHEMA_VERSION,
    row_counts,
    ...rows,
  }
}

export function snapshotFilename(exportedAt: string): string {
  const date = exportedAt.slice(0, 10)
  return `fittrack-export-${date}.json`
}
