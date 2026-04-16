'use client'

import { useState } from 'react'
import type { LogWorkoutResult } from './actions'
import { logMotraWorkoutFromForm } from './actions'

export function WorkoutLogForm() {
  const [text, setText] = useState('')
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<LogWorkoutResult | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setResult(null)
    const r = await logMotraWorkoutFromForm(text)
    setResult(r)
    setPending(false)
    if (r.ok) setText('')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        className="w-full rounded-[10px] border border-[#e8e8e4] bg-white p-3 text-sm text-[#1a1a1a] placeholder:text-[#bbb]"
        placeholder="Paste Motra share text…"
        disabled={pending}
      />
      <button
        type="submit"
        disabled={pending || !text.trim()}
        className="rounded-lg border border-[#e8e8e4] bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
      >
        {pending ? 'Saving…' : 'Log workout'}
      </button>
      {result && !result.ok ? (
        <p className="text-sm text-red-600">{result.message}</p>
      ) : null}
      {result && result.ok ? (
        <p className="text-sm text-[#15803d]">Saved. Workout id: {result.workoutId}</p>
      ) : null}
    </form>
  )
}
