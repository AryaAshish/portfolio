import { describe, expect, it } from 'vitest'
import {
  composeSnapshot,
  snapshotFilename,
  FITTRACK_EXPORT_SCHEMA_VERSION,
  type FitTrackExportRows,
} from './export-snapshot'

function emptyRows(overrides: Partial<FitTrackExportRows> = {}): FitTrackExportRows {
  return {
    user_profile: [],
    weight_logs: [],
    workouts: [],
    exercise_logs: [],
    meals: [],
    meal_templates: [],
    health_markers: [],
    plan_phases: [],
    food_library: [],
    ...overrides,
  }
}

describe('composeSnapshot', () => {
  it('wraps rows with exported_at and schema_version metadata', () => {
    const snap = composeSnapshot(emptyRows(), '2026-04-18T12:00:00.000Z')
    expect(snap.exported_at).toBe('2026-04-18T12:00:00.000Z')
    expect(snap.schema_version).toBe(FITTRACK_EXPORT_SCHEMA_VERSION)
  })

  it('includes every expected table key even when the database is empty', () => {
    const snap = composeSnapshot(emptyRows(), '2026-04-18T12:00:00.000Z')
    expect(Object.keys(snap)).toEqual(
      expect.arrayContaining([
        'user_profile',
        'weight_logs',
        'workouts',
        'exercise_logs',
        'meals',
        'meal_templates',
        'health_markers',
        'plan_phases',
        'food_library',
      ])
    )
  })

  it('reports accurate row_counts for each table', () => {
    const rows = emptyRows({
      meals: [{ id: 'm1' }, { id: 'm2' }],
      workouts: [{ id: 'w1' }],
      exercise_logs: [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }],
    })
    const snap = composeSnapshot(rows, '2026-04-18T00:00:00.000Z')
    expect(snap.row_counts.meals).toBe(2)
    expect(snap.row_counts.workouts).toBe(1)
    expect(snap.row_counts.exercise_logs).toBe(3)
    expect(snap.row_counts.weight_logs).toBe(0)
  })

  it('preserves original row data verbatim without mutation', () => {
    const meal = { id: 'm1', protein_g: 30 }
    const rows = emptyRows({ meals: [meal] })
    const snap = composeSnapshot(rows, '2026-04-18T00:00:00.000Z')
    expect(snap.meals).toEqual([meal])
    expect(rows.meals).toHaveLength(1)
  })
})

describe('snapshotFilename', () => {
  it('formats as fittrack-export-YYYY-MM-DD.json from an ISO timestamp', () => {
    expect(snapshotFilename('2026-04-18T12:34:56.789Z')).toBe(
      'fittrack-export-2026-04-18.json'
    )
  })

  it('handles date-only strings', () => {
    expect(snapshotFilename('2026-04-18')).toBe('fittrack-export-2026-04-18.json')
  })
})
