import type { FoodLibraryItem, MealComponent } from '@/lib/fittrack-supabase'

export type ScaledMacros = {
  protein_g: number
  calories: number
  carbs_g: number
  fat_g: number
}

export type MealTotals = ScaledMacros

function toNum(v: number | null | undefined): number {
  if (v == null) return 0
  if (typeof v === 'string') {
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : 0
  }
  return Number.isFinite(v) ? v : 0
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export function scaleFoodMacros(food: FoodLibraryItem, qty: number): ScaledMacros {
  if (!Number.isFinite(qty) || qty < 0) {
    throw new Error('qty must be a non-negative finite number')
  }
  const serving = toNum(food.serving_size_g)
  if (serving <= 0) {
    return {
      protein_g: round1(toNum(food.protein_g) * qty),
      calories: Math.round(toNum(food.calories) * qty),
      carbs_g: round1(toNum(food.carbs_g) * qty),
      fat_g: round1(toNum(food.fat_g) * qty),
    }
  }
  const factor = qty / serving
  return {
    protein_g: round1(toNum(food.protein_g) * factor),
    calories: Math.round(toNum(food.calories) * factor),
    carbs_g: round1(toNum(food.carbs_g) * factor),
    fat_g: round1(toNum(food.fat_g) * factor),
  }
}

export function componentFromFood(food: FoodLibraryItem, qty: number): MealComponent {
  const scaled = scaleFoodMacros(food, qty)
  return {
    food_id: food.id,
    food_name: food.name,
    qty,
    unit: food.serving_unit ?? 'g',
    per_serving_size: food.serving_size_g,
    protein_g: scaled.protein_g,
    calories: scaled.calories,
    carbs_g: scaled.carbs_g,
    fat_g: scaled.fat_g,
  }
}

export function sumComponents(components: MealComponent[]): MealTotals {
  let protein = 0
  let calories = 0
  let carbs = 0
  let fat = 0
  for (const c of components) {
    protein += toNum(c.protein_g)
    calories += toNum(c.calories)
    carbs += toNum(c.carbs_g)
    fat += toNum(c.fat_g)
  }
  return {
    protein_g: round1(protein),
    calories: Math.round(calories),
    carbs_g: round1(carbs),
    fat_g: round1(fat),
  }
}

export function componentsToText(components: MealComponent[]): string {
  return components
    .map((c) => `${c.qty}${c.unit} ${c.food_name}`)
    .join(', ')
}
