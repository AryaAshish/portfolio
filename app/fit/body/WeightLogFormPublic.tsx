'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FT } from '@/app/fittrack/_components/tokens'
import { logWeightAction } from './actions'

export function WeightLogForm({ date, latestKg }: { date: string; latestKg: number | null }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setErrors({})

    const fd = new FormData(e.currentTarget)
    const result = await logWeightAction(fd)

    if (result.ok) {
      formRef.current?.reset()
      router.refresh()
    } else {
      const errs: Record<string, string> = {}
      for (const err of result.errors) {
        errs[err.field] = err.message
      }
      setErrors(errs)
    }
    setPending(false)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-2.5">
      <input type="hidden" name="date" value={date} />

      <div>
        <div className="flex items-center gap-2">
          <input
            name="weight_kg"
            type="number"
            step="0.01"
            min="0"
            placeholder={latestKg ? `Last: ${latestKg} kg` : 'Weight (kg)'}
            className="flex-1 rounded-lg px-3 py-2 text-sm"
            style={{
              background: FT.canvas,
              border: `1px solid ${errors.weight_kg ? FT.danger : FT.border}`,
              color: FT.textPrimary,
            }}
            disabled={pending}
          />
          <input
            name="body_fat_pct"
            type="number"
            step="0.1"
            min="0"
            max="70"
            placeholder="BF%"
            className="w-20 rounded-lg px-3 py-2 text-sm"
            style={{
              background: FT.canvas,
              border: `1px solid ${errors.body_fat_pct ? FT.danger : FT.border}`,
              color: FT.textPrimary,
            }}
            disabled={pending}
          />
        </div>
        {(errors.weight_kg || errors.body_fat_pct) && (
          <p className="text-xs mt-1" style={{ color: FT.danger }}>
            {errors.weight_kg || errors.body_fat_pct}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          name="notes"
          type="text"
          placeholder="Notes (optional)"
          className="flex-1 rounded-lg px-3 py-2 text-sm"
          style={{
            background: FT.canvas,
            border: `1px solid ${FT.border}`,
            color: FT.textPrimary,
          }}
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
          style={{ background: FT.accent, color: '#fff' }}
        >
          {pending ? 'Saving…' : 'Log'}
        </button>
      </div>
    </form>
  )
}
