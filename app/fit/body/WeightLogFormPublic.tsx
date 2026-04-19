'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FT } from '@/app/fittrack/_components/tokens'
import { logWeightAction } from './actions'

export function WeightLogForm({ date, latestKg }: { date: string; latestKg: number | null }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => setSuccess(false), 3000)
    return () => clearTimeout(t)
  }, [success])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setErrors({})
    setSuccess(false)

    const fd = new FormData(e.currentTarget)
    try {
      const result = await logWeightAction(fd)

      if (result.ok) {
        formRef.current?.reset()
        setSuccess(true)
        router.refresh()
      } else {
        const errs: Record<string, string> = {}
        for (const err of result.errors) {
          errs[err.field] = err.message
        }
        setErrors(errs)
      }
    } catch {
      setErrors({ _form: 'Something went wrong. Please try again.' })
    }
    setPending(false)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-2.5">
      <input type="hidden" name="date" value={date} />

      {success && (
        <div
          className="text-xs font-medium rounded-lg px-3 py-2"
          style={{ background: FT.successBg, color: FT.success }}
        >
          Weight logged successfully.
        </div>
      )}

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
            placeholder="BF% (optional)"
            className="w-20 rounded-lg px-3 py-2 text-sm"
            style={{
              background: FT.canvas,
              border: `1px solid ${errors.body_fat_pct ? FT.danger : FT.border}`,
              color: FT.textPrimary,
            }}
            disabled={pending}
          />
        </div>
        {(errors.weight_kg || errors.body_fat_pct || errors.date || errors._form) && (
          <div className="text-xs mt-1 space-y-0.5" style={{ color: FT.danger }}>
            {errors.date && <p>{errors.date}</p>}
            {errors.weight_kg && <p>{errors.weight_kg}</p>}
            {errors.body_fat_pct && <p>{errors.body_fat_pct}</p>}
            {errors._form && <p>{errors._form}</p>}
          </div>
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
