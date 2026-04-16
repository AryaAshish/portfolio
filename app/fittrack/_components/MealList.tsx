'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Meal } from '@/lib/fittrack-supabase'
import { updateMealAction, deleteMealAction } from '../meals/actions'
import { FT } from './tokens'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

function MealRow({ meal }: { meal: Meal }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [pending, setPending] = useState(false)

  const [mealType, setMealType] = useState<MealType>((meal.meal_type ?? 'snack') as MealType)
  const [items, setItems] = useState(meal.items)
  const [proteinG, setProteinG] = useState(meal.protein_g != null ? String(Math.round(meal.protein_g)) : '')
  const [calories, setCalories] = useState(meal.calories != null ? String(Math.round(meal.calories)) : '')
  const [carbsG, setCarbsG] = useState(meal.carbs_g != null ? String(Math.round(meal.carbs_g)) : '')
  const [fatG, setFatG] = useState(meal.fat_g != null ? String(Math.round(meal.fat_g)) : '')

  async function handleDelete() {
    setPending(true)
    await deleteMealAction(meal.id)
    router.refresh()
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    const fd = new FormData()
    fd.set('id', meal.id)
    fd.set('meal_type', mealType)
    fd.set('items', items)
    fd.set('protein_g', proteinG || '0')
    fd.set('calories', calories || '0')
    fd.set('carbs_g', carbsG || '0')
    fd.set('fat_g', fatG || '0')
    await updateMealAction(fd)
    setPending(false)
    setEditing(false)
    router.refresh()
  }

  if (editing) {
    return (
      <form onSubmit={handleUpdate} className="space-y-1.5 py-1.5" style={{ borderTop: `1px solid ${FT.borderSubtle}` }}>
        <div className="flex gap-1.5">
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="rounded border px-1.5 py-1 text-[11px]"
            style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <input
            value={items}
            onChange={(e) => setItems(e.target.value)}
            className="rounded border px-1.5 py-1 text-[11px] flex-1"
            style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
            required
          />
        </div>
        <div className="grid grid-cols-4 gap-1">
          <input value={proteinG} onChange={(e) => setProteinG(e.target.value)} type="number" placeholder="Prot" className="rounded border px-1.5 py-1 text-[11px]" style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }} />
          <input value={calories} onChange={(e) => setCalories(e.target.value)} type="number" placeholder="Cal" className="rounded border px-1.5 py-1 text-[11px]" style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }} />
          <input value={carbsG} onChange={(e) => setCarbsG(e.target.value)} type="number" placeholder="Carbs" className="rounded border px-1.5 py-1 text-[11px]" style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }} />
          <input value={fatG} onChange={(e) => setFatG(e.target.value)} type="number" placeholder="Fat" className="rounded border px-1.5 py-1 text-[11px]" style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={pending || !items.trim()} className="text-[11px] font-semibold disabled:opacity-40" style={{ color: FT.accent }}>
            {pending ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => setEditing(false)} className="text-[11px]" style={{ color: FT.textMuted }}>Cancel</button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex items-center justify-between text-xs py-1 group">
      <span style={{ color: FT.textPrimary }}>{meal.items}</span>
      <div className="flex items-center gap-2">
        <span style={{ color: FT.textMuted }}>
          {meal.protein_g != null && `${Math.round(meal.protein_g)}p`}
          {meal.calories != null && ` · ${Math.round(meal.calories)} cal`}
        </span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] px-1"
          style={{ color: FT.textMuted }}
          title="Edit"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] px-1 disabled:opacity-20"
          style={{ color: FT.danger }}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

const MEAL_ORDER: Record<string, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 }

export function MealList({ meals, isToday }: { meals: Meal[]; isToday: boolean }) {
  const mealsByType = meals.reduce<Record<string, Meal[]>>((acc, m) => {
    const key = m.meal_type ?? 'snack'
    ;(acc[key] ??= []).push(m)
    return acc
  }, {})
  const sortedTypes = Object.keys(mealsByType).sort(
    (a, b) => (MEAL_ORDER[a] ?? 9) - (MEAL_ORDER[b] ?? 9)
  )

  if (sortedTypes.length === 0) return null

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: FT.textMuted }}>
        {isToday ? 'Meals Today' : 'Meals'}
      </p>
      <div className="space-y-2">
        {sortedTypes.map((type) => (
          <div
            key={type}
            className="rounded-xl p-3"
            style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 capitalize" style={{ color: FT.textSecondary }}>
              {type}
            </p>
            {mealsByType[type].map((m) => (
              <MealRow key={m.id} meal={m} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
