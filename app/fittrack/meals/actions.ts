'use server'

import { revalidatePath } from 'next/cache'
import { getMealTemplateById, saveMeal, updateMeal, deleteMeal } from '@/lib/fittrack-supabase'
import type { Meal } from '@/lib/fittrack-supabase'

export async function addMealAction(formData: FormData) {
  const date = String(formData.get('date') ?? '').trim()
  const meal_type = String(formData.get('meal_type') ?? 'lunch').trim() as Meal['meal_type']
  const items = String(formData.get('items') ?? '').trim()
  const protein_g = Number(formData.get('protein_g')) || 0
  const calories = Number(formData.get('calories')) || 0
  const carbs_g = Number(formData.get('carbs_g')) || null
  const fat_g = Number(formData.get('fat_g')) || null
  if (!date || !items) return { ok: false as const, message: 'Date and items are required' }
  await saveMeal({
    date,
    meal_type,
    items,
    protein_g,
    calories,
    carbs_g,
    fat_g,
    image_url: null,
    notes: null,
  })
  revalidatePath('/fittrack/body')
  return { ok: true as const }
}

export async function applyTemplateAction(formData: FormData) {
  const date = String(formData.get('date') ?? '').trim()
  const templateId = String(formData.get('template_id') ?? '').trim()
  if (!date || !templateId) return { ok: false as const, message: 'Missing data' }
  const t = await getMealTemplateById(templateId)
  if (!t) return { ok: false as const, message: 'Template not found' }
  const items = t.items.map((i) => `${i.qty} ${i.unit} ${i.food}`).join(', ')
  await saveMeal({
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
  revalidatePath('/fittrack/body')
  return { ok: true as const }
}

export async function updateMealAction(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim()
  const meal_type = String(formData.get('meal_type') ?? 'lunch').trim() as Meal['meal_type']
  const items = String(formData.get('items') ?? '').trim()
  const protein_g = Number(formData.get('protein_g')) || 0
  const calories = Number(formData.get('calories')) || 0
  const carbs_g = Number(formData.get('carbs_g')) || null
  const fat_g = Number(formData.get('fat_g')) || null
  if (!id || !items) return { ok: false as const, message: 'ID and items are required' }
  await updateMeal(id, { meal_type, items, protein_g, calories, carbs_g, fat_g })
  revalidatePath('/fittrack/body')
  return { ok: true as const }
}

export async function deleteMealAction(id: string) {
  if (!id) return { ok: false as const, message: 'Missing id' }
  await deleteMeal(id)
  revalidatePath('/fittrack/body')
  return { ok: true as const }
}
