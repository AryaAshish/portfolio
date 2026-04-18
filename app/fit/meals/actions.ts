'use server'

import { revalidatePath } from 'next/cache'
import { createFitPublicServerClient } from '@/lib/fit-public/client-server'
import {
  saveMeal,
  addMealWithComponents,
  updateMeal,
  deleteMeal,
  getMealTemplateById,
  saveMealAsTemplate,
} from '@/lib/fit-public/data'
import type { Meal, MealComponent } from '@/lib/fittrack-supabase'

export async function addMealAction(formData: FormData) {
  const date = String(formData.get('date') ?? '').trim()
  const meal_type = String(formData.get('meal_type') ?? 'lunch').trim() as Meal['meal_type']
  const items = String(formData.get('items') ?? '').trim()
  const protein_g = Number(formData.get('protein_g')) || 0
  const calories = Number(formData.get('calories')) || 0
  const carbsRaw = formData.get('carbs_g')
  const fatRaw = formData.get('fat_g')
  const carbs_g = carbsRaw != null && String(carbsRaw).trim() !== '' ? Number(carbsRaw) : null
  const fat_g = fatRaw != null && String(fatRaw).trim() !== '' ? Number(fatRaw) : null
  if (!date || !items) return { ok: false as const, message: 'Date and items are required' }
  try {
    const client = createFitPublicServerClient()
    await saveMeal(client, {
      date, meal_type, items, protein_g, calories, carbs_g, fat_g,
      image_url: null, notes: null,
    })
    revalidatePath('/fit/body')
    return { ok: true as const }
  } catch (e) {
    return { ok: false as const, message: e instanceof Error ? e.message : 'Failed to save meal' }
  }
}

export async function applyTemplateAction(formData: FormData) {
  const date = String(formData.get('date') ?? '').trim()
  const templateId = String(formData.get('template_id') ?? '').trim()
  if (!date || !templateId) return { ok: false as const, message: 'Missing data' }
  const client = createFitPublicServerClient()
  try {
    const t = await getMealTemplateById(client, templateId)
    if (!t) return { ok: false as const, message: 'Template not found' }
    const items = t.items.map((i: any) => `${i.qty} ${i.unit} ${i.food}`).join(', ')
    await saveMeal(client, {
      date,
      meal_type: (t.meal_type as Meal['meal_type']) ?? 'lunch',
      items,
      protein_g: t.total_protein_g,
      calories: t.total_calories,
      carbs_g: t.total_carbs_g,
      fat_g: t.total_fat_g,
      image_url: null,
      notes: t.name,
    })
    revalidatePath('/fit/body')
    return { ok: true as const }
  } catch (e) {
    return { ok: false as const, message: e instanceof Error ? e.message : 'Failed to apply template' }
  }
}

export async function updateMealAction(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim()
  const meal_type = String(formData.get('meal_type') ?? 'lunch').trim() as Meal['meal_type']
  const items = String(formData.get('items') ?? '').trim()
  const protein_g = Number(formData.get('protein_g')) || 0
  const calories = Number(formData.get('calories')) || 0
  const carbsRaw2 = formData.get('carbs_g')
  const fatRaw2 = formData.get('fat_g')
  const carbs_g = carbsRaw2 != null && String(carbsRaw2).trim() !== '' ? Number(carbsRaw2) : null
  const fat_g = fatRaw2 != null && String(fatRaw2).trim() !== '' ? Number(fatRaw2) : null
  if (!id || !items) return { ok: false as const, message: 'ID and items are required' }
  try {
    const client = createFitPublicServerClient()
    await updateMeal(client, id, { meal_type, items, protein_g, calories, carbs_g, fat_g })
    revalidatePath('/fit/body')
    return { ok: true as const }
  } catch (e) {
    return { ok: false as const, message: e instanceof Error ? e.message : 'Failed to update meal' }
  }
}

export async function deleteMealAction(id: string) {
  if (!id) return { ok: false as const, message: 'Missing id' }
  try {
    const client = createFitPublicServerClient()
    await deleteMeal(client, id)
    revalidatePath('/fit/body')
    return { ok: true as const }
  } catch (e) {
    return { ok: false as const, message: e instanceof Error ? e.message : 'Failed to delete meal' }
  }
}

function sanitizeComponents(raw: unknown): MealComponent[] | null {
  if (!Array.isArray(raw)) return null
  const out: MealComponent[] = []
  for (const row of raw) {
    if (!row || typeof row !== 'object') return null
    const r = row as Record<string, unknown>
    const food_id = typeof r.food_id === 'string' ? r.food_id : ''
    const food_name = typeof r.food_name === 'string' ? r.food_name : ''
    const qty = typeof r.qty === 'number' ? r.qty : Number(r.qty)
    if (!food_id || !food_name) return null
    if (!Number.isFinite(qty) || qty < 0) return null
    out.push({
      food_id, food_name, qty,
      unit: typeof r.unit === 'string' ? r.unit : 'g',
      per_serving_size: typeof r.per_serving_size === 'number' ? r.per_serving_size : null,
      protein_g: typeof r.protein_g === 'number' ? r.protein_g : 0,
      calories: typeof r.calories === 'number' ? r.calories : 0,
      carbs_g: typeof r.carbs_g === 'number' ? r.carbs_g : 0,
      fat_g: typeof r.fat_g === 'number' ? r.fat_g : 0,
    })
  }
  return out
}

export async function addMealWithComponentsAction(input: {
  date: string; meal_type: Meal['meal_type']; components: MealComponent[]; notes?: string | null
}) {
  const date = (input.date ?? '').trim()
  if (!date) return { ok: false as const, message: 'Date is required' }
  const components = sanitizeComponents(input.components)
  if (!components || components.length === 0) {
    return { ok: false as const, message: 'Pick at least one item' }
  }
  try {
    const client = createFitPublicServerClient()
    await addMealWithComponents(client, {
      date, meal_type: input.meal_type, components, notes: input.notes ?? null,
    })
    revalidatePath('/fit')
    revalidatePath('/fit/body')
    return { ok: true as const }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false as const, message: msg }
  }
}

export async function saveTemplateAction(input: {
  name: string; meal_type: Meal['meal_type'] | null; components: MealComponent[]
}) {
  const name = (input.name ?? '').trim()
  if (!name) return { ok: false as const, message: 'Name is required' }
  const components = sanitizeComponents(input.components)
  if (!components || components.length === 0) {
    return { ok: false as const, message: 'Pick at least one item' }
  }
  try {
    const client = createFitPublicServerClient()
    await saveMealAsTemplate(client, { name, meal_type: input.meal_type, components })
    revalidatePath('/fit/body')
    return { ok: true as const }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false as const, message: msg }
  }
}
