'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FoodLibraryItem, MealTemplate } from '@/lib/fittrack-supabase'
import { addMealAction } from '../meals/actions'
import { MealComposer } from './MealComposer'
import { FT } from './tokens'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export function MealForm({
  date,
  templates,
  foods,
}: {
  date: string
  templates: MealTemplate[]
  foods: FoodLibraryItem[]
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [showComposer, setShowComposer] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [mealType, setMealType] = useState<MealType>('lunch')
  const [items, setItems] = useState('')
  const [proteinG, setProteinG] = useState('')
  const [calories, setCalories] = useState('')
  const [carbsG, setCarbsG] = useState('')
  const [fatG, setFatG] = useState('')

  function prefill(t: MealTemplate) {
    const itemStr = t.items.map((i) => `${i.qty} ${i.unit} ${i.food}`).join(', ')
    setItems(itemStr)
    setMealType((t.meal_type as MealType) ?? 'lunch')
    setProteinG(t.total_protein_g != null ? String(Math.round(t.total_protein_g)) : '')
    setCalories(t.total_calories != null ? String(Math.round(t.total_calories)) : '')
    setCarbsG(t.total_carbs_g != null ? String(Math.round(t.total_carbs_g)) : '')
    setFatG(t.total_fat_g != null ? String(Math.round(t.total_fat_g)) : '')
    setShowForm(true)
    setError(null)
  }

  function resetForm() {
    setShowForm(false)
    setItems('')
    setProteinG('')
    setCalories('')
    setCarbsG('')
    setFatG('')
    setMealType('lunch')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const fd = new FormData()
    fd.set('date', date)
    fd.set('meal_type', mealType)
    fd.set('items', items)
    fd.set('protein_g', proteinG || '0')
    fd.set('calories', calories || '0')
    fd.set('carbs_g', carbsG || '0')
    fd.set('fat_g', fatG || '0')

    const result = await addMealAction(fd)
    setPending(false)
    if (result.ok) {
      resetForm()
      router.refresh()
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="space-y-3">
      {templates.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => prefill(t)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{ background: FT.accentBg, color: FT.accent }}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {showComposer ? (
        <MealComposer
          date={date}
          foods={foods}
          onCancel={() => setShowComposer(false)}
        />
      ) : !showForm ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            type="button"
            onClick={() => setShowComposer(true)}
            className="text-xs font-semibold"
            style={{ color: FT.accent }}
          >
            + Build from items
          </button>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-xs font-medium"
            style={{ color: FT.textSecondary }}
          >
            + Add manually
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
              className="rounded-lg border px-2 py-1.5 text-xs flex-shrink-0"
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
              placeholder="What did you eat?"
              className="rounded-lg border px-2 py-1.5 text-xs flex-1"
              style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            <input
              value={proteinG}
              onChange={(e) => setProteinG(e.target.value)}
              type="number"
              placeholder="Protein"
              className="rounded-lg border px-2 py-1.5 text-xs"
              style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
            />
            <input
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              type="number"
              placeholder="Calories"
              className="rounded-lg border px-2 py-1.5 text-xs"
              style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
            />
            <input
              value={carbsG}
              onChange={(e) => setCarbsG(e.target.value)}
              type="number"
              placeholder="Carbs"
              className="rounded-lg border px-2 py-1.5 text-xs"
              style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
            />
            <input
              value={fatG}
              onChange={(e) => setFatG(e.target.value)}
              type="number"
              placeholder="Fat"
              className="rounded-lg border px-2 py-1.5 text-xs"
              style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending || !items.trim()}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
              style={{ background: FT.accent }}
            >
              {pending ? 'Saving...' : 'Save meal'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs"
              style={{ color: FT.textMuted }}
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-xs" style={{ color: FT.danger }}>{error}</p>}
        </form>
      )}
    </div>
  )
}
