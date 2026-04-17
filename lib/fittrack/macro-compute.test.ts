import { describe, expect, it } from 'vitest'
import type { FoodLibraryItem, MealComponent } from '@/lib/fittrack-supabase'
import {
  componentFromFood,
  componentsToText,
  scaleFoodMacros,
  sumComponents,
} from './macro-compute'

function food(overrides: Partial<FoodLibraryItem> = {}): FoodLibraryItem {
  return {
    id: 'f1',
    name: 'Amul Taaza milk',
    serving_size_g: 100,
    serving_unit: 'ml',
    protein_g: 3.2,
    calories: 58,
    carbs_g: 4.5,
    fat_g: 3,
    category: 'dairy',
    notes: null,
    created_at: '2026-04-17T00:00:00Z',
    ...overrides,
  }
}

function comp(overrides: Partial<MealComponent> = {}): MealComponent {
  return {
    food_id: 'f1',
    food_name: 'Amul Taaza milk',
    qty: 100,
    unit: 'ml',
    per_serving_size: 100,
    protein_g: 3.2,
    calories: 58,
    carbs_g: 4.5,
    fat_g: 3,
    ...overrides,
  }
}

describe('scaleFoodMacros', () => {
  it('returns one serving at qty equal to serving size', () => {
    const r = scaleFoodMacros(food(), 100)
    expect(r).toEqual({ protein_g: 3.2, calories: 58, carbs_g: 4.5, fat_g: 3 })
  })

  it('doubles macros at qty 2x serving size', () => {
    const r = scaleFoodMacros(food(), 200)
    expect(r.protein_g).toBe(6.4)
    expect(r.calories).toBe(116)
    expect(r.carbs_g).toBe(9)
    expect(r.fat_g).toBe(6)
  })

  it('handles fractional qty (e.g. half serving)', () => {
    const r = scaleFoodMacros(food(), 50)
    expect(r.protein_g).toBe(1.6)
    expect(r.calories).toBe(29)
  })

  it('returns zero macros for qty zero', () => {
    const r = scaleFoodMacros(food(), 0)
    expect(r).toEqual({ protein_g: 0, calories: 0, carbs_g: 0, fat_g: 0 })
  })

  it('rejects negative qty', () => {
    expect(() => scaleFoodMacros(food(), -10)).toThrow()
  })

  it('rejects NaN qty', () => {
    expect(() => scaleFoodMacros(food(), Number.NaN)).toThrow()
  })

  it('tolerates null/missing macro fields', () => {
    const r = scaleFoodMacros(food({ protein_g: null, carbs_g: null }), 200)
    expect(r.protein_g).toBe(0)
    expect(r.carbs_g).toBe(0)
    expect(r.calories).toBe(116)
  })

  it('falls back to per-unit scaling when serving_size_g is missing or zero', () => {
    const r = scaleFoodMacros(food({ serving_size_g: null }), 2)
    expect(r.calories).toBe(116)
    expect(r.protein_g).toBe(6.4)
  })

  it('scales piece-based items correctly (roti 40g = 1 piece = 90 cal)', () => {
    const roti = food({
      name: 'Roti wheat',
      serving_size_g: 40,
      serving_unit: 'piece',
      protein_g: 3,
      calories: 90,
      carbs_g: 18,
      fat_g: 1,
    })
    const r = scaleFoodMacros(roti, 80)
    expect(r.calories).toBe(180)
    expect(r.protein_g).toBe(6)
  })
})

describe('componentFromFood', () => {
  it('produces a MealComponent with scaled macros and food metadata', () => {
    const c = componentFromFood(food(), 200)
    expect(c.food_id).toBe('f1')
    expect(c.food_name).toBe('Amul Taaza milk')
    expect(c.qty).toBe(200)
    expect(c.unit).toBe('ml')
    expect(c.per_serving_size).toBe(100)
    expect(c.calories).toBe(116)
    expect(c.protein_g).toBe(6.4)
  })

  it('defaults unit to "g" when serving_unit is null', () => {
    const c = componentFromFood(food({ serving_unit: null }), 100)
    expect(c.unit).toBe('g')
  })

  it('stamps schema_version=1 so future jsonb shape changes stay backward-compatible', () => {
    const c = componentFromFood(food(), 100)
    expect(c.schema_version).toBe(1)
  })
})

describe('sumComponents', () => {
  it('returns zeros for empty list', () => {
    expect(sumComponents([])).toEqual({ protein_g: 0, calories: 0, carbs_g: 0, fat_g: 0 })
  })

  it('sums a single component', () => {
    expect(sumComponents([comp()])).toEqual({
      protein_g: 3.2,
      calories: 58,
      carbs_g: 4.5,
      fat_g: 3,
    })
  })

  it('sums multiple components with rounding', () => {
    const oats = comp({ food_name: 'Oats', protein_g: 8.8, calories: 183, carbs_g: 20.4, fat_g: 7.6 })
    const milk = comp({ food_name: 'Milk', protein_g: 6.4, calories: 116, carbs_g: 9, fat_g: 6 })
    const whey = comp({ food_name: 'Whey', protein_g: 24, calories: 120, carbs_g: 2, fat_g: 1 })
    const r = sumComponents([oats, milk, whey])
    expect(r.protein_g).toBe(39.2)
    expect(r.calories).toBe(419)
    expect(r.carbs_g).toBe(31.4)
    expect(r.fat_g).toBe(14.6)
  })

  it('tolerates components with missing numeric fields (treated as 0)', () => {
    const bad = comp({
      protein_g: Number.NaN as unknown as number,
      calories: null as unknown as number,
      carbs_g: undefined as unknown as number,
    })
    const r = sumComponents([bad])
    expect(r.protein_g).toBe(0)
    expect(r.calories).toBe(0)
    expect(r.carbs_g).toBe(0)
    expect(r.fat_g).toBe(3)
  })

  it('reads legacy rows without schema_version (pre-versioning backward-compat)', () => {
    const legacy = comp()
    delete (legacy as { schema_version?: number }).schema_version
    const r = sumComponents([legacy])
    expect(r).toEqual({ protein_g: 3.2, calories: 58, carbs_g: 4.5, fat_g: 3 })
  })
})

describe('componentsToText', () => {
  it('formats qty + unit + name joined by commas', () => {
    const oats = comp({ qty: 40, unit: 'g', food_name: 'Oats' })
    const milk = comp({ qty: 200, unit: 'ml', food_name: 'Milk' })
    expect(componentsToText([oats, milk])).toBe('40g Oats, 200ml Milk')
  })

  it('returns empty string for empty list', () => {
    expect(componentsToText([])).toBe('')
  })
})
