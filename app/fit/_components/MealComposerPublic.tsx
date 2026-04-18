'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FoodLibraryItem, Meal, MealComponent } from '@/lib/fittrack-supabase'
import { componentFromFood, scaleFoodMacros, sumComponents } from '@/lib/fittrack/macro-compute'
import { addMealWithComponentsAction, saveTemplateAction } from '../meals/actions'
import { FT } from '@/app/fittrack/_components/tokens'

type MealType = Meal['meal_type']

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
  { value: 'pre_workout', label: 'Pre-workout' },
]

export function MealComposerPublic({ date, foods, onCancel }: { date: string; foods: FoodLibraryItem[]; onCancel: () => void }) {
  const router = useRouter()
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [picked, setPicked] = useState<MealComponent[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveTplOpen, setSaveTplOpen] = useState(false)
  const [tplName, setTplName] = useState('')

  const categories = useMemo(() => { const set = new Set<string>(); for (const f of foods) { if (f.category) set.add(f.category) }; return ['all', ...Array.from(set).sort()] }, [foods])
  const filtered = useMemo(() => { const q = search.trim().toLowerCase(); return foods.filter((f) => { if (category !== 'all' && f.category !== category) return false; if (!q) return true; return f.name.toLowerCase().includes(q) }) }, [foods, search, category])
  const grouped = useMemo(() => { const m = new Map<string, FoodLibraryItem[]>(); for (const f of filtered) { const key = f.category ?? 'other'; const arr = m.get(key) ?? []; arr.push(f); m.set(key, arr) }; return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0])) }, [filtered])
  const totals = useMemo(() => sumComponents(picked), [picked])

  function addFood(food: FoodLibraryItem) {
    const qty = food.serving_size_g && food.serving_size_g > 0 ? food.serving_size_g : 100
    setPicked((prev) => {
      const existingIdx = prev.findIndex((p) => p.food_id === food.id)
      if (existingIdx >= 0) { const next = [...prev]; const newQty = next[existingIdx].qty + qty; const scaled = scaleFoodMacros(food, newQty); next[existingIdx] = { ...next[existingIdx], qty: newQty, ...scaled }; return next }
      return [...prev, componentFromFood(food, qty)]
    })
  }

  function setQty(idx: number, qtyStr: string) {
    const qty = Number(qtyStr); if (!Number.isFinite(qty) || qty < 0) return
    setPicked((prev) => { const row = prev[idx]; if (!row) return prev; const food = foods.find((f) => f.id === row.food_id); const scaled = food ? scaleFoodMacros(food, qty) : { protein_g: 0, calories: 0, carbs_g: 0, fat_g: 0 }; const next = [...prev]; next[idx] = { ...row, qty, ...scaled }; return next })
  }

  function removeAt(idx: number) { setPicked((prev) => prev.filter((_, i) => i !== idx)) }

  async function handleLog() {
    if (picked.length === 0) { setError('Pick at least one item'); return }
    setPending(true); setError(null)
    const res = await addMealWithComponentsAction({ date, meal_type: mealType, components: picked })
    setPending(false)
    if (res.ok) { setPicked([]); onCancel(); router.refresh() } else { setError(res.message) }
  }

  async function handleSaveTemplate() {
    const name = tplName.trim(); if (!name) { setError('Template name is required'); return }
    if (picked.length === 0) { setError('Pick at least one item'); return }
    setPending(true); setError(null)
    const res = await saveTemplateAction({ name, meal_type: mealType, components: picked })
    setPending(false)
    if (res.ok) { setSaveTplOpen(false); setTplName(''); router.refresh() } else { setError(res.message) }
  }

  return (
    <div className="rounded-xl p-3 space-y-3" style={{ background: FT.surface, border: `1px solid ${FT.border}` }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: FT.textPrimary }}>Build meal from items</p>
        <button type="button" onClick={onCancel} className="text-xs" style={{ color: FT.textMuted }}>Close</button>
      </div>
      <div className="flex gap-2">
        <select value={mealType} onChange={(e) => setMealType(e.target.value as MealType)} className="rounded-lg border px-2 py-1.5 text-xs" style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }}>
          {MEAL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="rounded-lg border px-2 py-1.5 text-xs flex-1" style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }} />
      </div>
      <div className="flex gap-1 overflow-x-auto -mx-1 px-1">
        {categories.map((c) => (<button key={c} type="button" onClick={() => setCategory(c)} className="rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap" style={{ background: category === c ? FT.accent : FT.accentBg, color: category === c ? '#fff' : FT.accent }}>{c}</button>))}
      </div>
      <div className="max-h-64 overflow-y-auto rounded-lg" style={{ border: `1px solid ${FT.borderSubtle}` }}>
        {grouped.length === 0 ? (<p className="p-3 text-xs" style={{ color: FT.textMuted }}>No items match.</p>) : (
          grouped.map(([cat, items]) => (<div key={cat}><div className="px-2.5 py-1 text-[10px] uppercase tracking-wide font-semibold" style={{ background: FT.canvas, color: FT.textSecondary }}>{cat}</div>
            {items.map((f) => (<button key={f.id} type="button" onClick={() => addFood(f)} className="w-full flex items-center justify-between px-2.5 py-1.5 text-left hover:bg-[color:var(--hov)] transition-colors" style={{ ['--hov' as string]: FT.canvas, borderTop: `1px solid ${FT.borderSubtle}` }}>
              <div className="min-w-0 flex-1"><p className="text-xs font-medium truncate" style={{ color: FT.textPrimary }}>{f.name}</p><p className="text-[10px]" style={{ color: FT.textMuted }}>per {f.serving_size_g ?? '-'}{f.serving_unit ?? 'g'}: {f.calories ?? 0}cal · {f.protein_g ?? 0}p · {f.carbs_g ?? 0}c · {f.fat_g ?? 0}f</p></div>
              <span className="ml-2 rounded px-2 py-0.5 text-[10px] font-semibold flex-shrink-0" style={{ background: FT.accentBg, color: FT.accent }}>+ Add</span>
            </button>))}
          </div>))
        )}
      </div>
      {picked.length > 0 && (<div className="space-y-1.5"><p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: FT.textSecondary }}>Picked ({picked.length})</p>
        {picked.map((c, i) => (<div key={`${c.food_id}-${i}`} className="flex items-center gap-2 rounded-lg p-1.5" style={{ background: FT.canvas }}>
          <div className="min-w-0 flex-1"><p className="text-xs font-medium truncate" style={{ color: FT.textPrimary }}>{c.food_name}</p><p className="text-[10px]" style={{ color: FT.textMuted }}>{c.calories}cal · {c.protein_g}p · {c.carbs_g}c · {c.fat_g}f</p></div>
          <input type="number" min={0} step={1} value={c.qty} onChange={(e) => setQty(i, e.target.value)} className="rounded border px-1.5 py-1 text-xs w-16" style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }} />
          <span className="text-[10px]" style={{ color: FT.textMuted }}>{c.unit}</span>
          <button type="button" onClick={() => removeAt(i)} className="text-[10px] font-medium" style={{ color: FT.danger }}>Remove</button>
        </div>))}
      </div>)}
      <div className="rounded-lg p-2 flex items-center justify-between" style={{ background: FT.accentBg }}>
        <p className="text-xs font-semibold" style={{ color: FT.accent }}>Total</p>
        <p className="text-xs font-semibold" style={{ color: FT.accent }}>{totals.calories}cal · {totals.protein_g}p · {totals.carbs_g}c · {totals.fat_g}f</p>
      </div>
      {error && <p className="text-xs" style={{ color: FT.danger }}>{error}</p>}
      {saveTplOpen ? (
        <div className="flex gap-2">
          <input value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder="Template name" className="rounded-lg border px-2 py-1.5 text-xs flex-1" style={{ borderColor: FT.border, background: FT.surface, color: FT.textPrimary }} autoFocus />
          <button type="button" onClick={handleSaveTemplate} disabled={pending || !tplName.trim()} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40" style={{ background: FT.accent }}>{pending ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => { setSaveTplOpen(false); setTplName(''); setError(null) }} className="text-xs" style={{ color: FT.textMuted }}>Cancel</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button type="button" onClick={handleLog} disabled={pending || picked.length === 0} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40" style={{ background: FT.accent }}>{pending ? 'Saving...' : 'Log meal'}</button>
          <button type="button" onClick={() => setSaveTplOpen(true)} disabled={pending || picked.length === 0} className="rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-40" style={{ background: FT.surface, color: FT.textPrimary, border: `1px solid ${FT.border}` }}>Save as template</button>
        </div>
      )}
    </div>
  )
}
