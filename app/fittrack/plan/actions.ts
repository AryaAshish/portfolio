'use server'

import { revalidatePath } from 'next/cache'
import {
  replacePlanPhases,
  resetPlanPhasesToDefaults,
} from '@/lib/fittrack-supabase'
import { validatePhases, type PhaseInput } from '@/lib/fittrack/plan-helpers'

type ClientPhase = {
  phase_number: number
  name: string
  start_date: string
  end_date: string
  focus: string | null
}

function sanitize(raw: unknown): ClientPhase[] | null {
  if (!Array.isArray(raw)) return null
  const out: ClientPhase[] = []
  for (const r of raw) {
    if (!r || typeof r !== 'object') return null
    const rec = r as Record<string, unknown>
    const phase_number =
      typeof rec.phase_number === 'number' ? rec.phase_number : Number(rec.phase_number)
    const name = typeof rec.name === 'string' ? rec.name.trim() : ''
    const start_date = typeof rec.start_date === 'string' ? rec.start_date : ''
    const end_date = typeof rec.end_date === 'string' ? rec.end_date : ''
    const focus =
      rec.focus == null
        ? null
        : typeof rec.focus === 'string'
          ? rec.focus.trim() || null
          : null
    if (!Number.isFinite(phase_number) || phase_number < 1) return null
    if (!name) return null
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start_date)) return null
    if (!/^\d{4}-\d{2}-\d{2}$/.test(end_date)) return null
    out.push({ phase_number, name, start_date, end_date, focus })
  }
  return out
}

export async function savePhasesAction(phases: unknown) {
  const clean = sanitize(phases)
  if (!clean) return { ok: false as const, message: 'Invalid input' }
  if (clean.length === 0) {
    return { ok: false as const, message: 'At least one phase is required' }
  }

  const renumbered = clean
    .sort((a, b) => a.phase_number - b.phase_number)
    .map((p, i) => ({ ...p, phase_number: i + 1 }))

  const inputs: PhaseInput[] = renumbered.map((p) => ({
    phase_number: p.phase_number,
    name: p.name,
    start_date: p.start_date,
    end_date: p.end_date,
    focus: p.focus,
  }))
  const errs = validatePhases(inputs)
  if (errs.length > 0) {
    return { ok: false as const, message: errs[0].message, errors: errs }
  }

  try {
    await replacePlanPhases(renumbered)
    revalidatePath('/fittrack')
    revalidatePath('/fittrack/plan')
    return { ok: true as const }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false as const, message: msg }
  }
}

export async function resetPhasesAction() {
  try {
    await resetPlanPhasesToDefaults()
    revalidatePath('/fittrack')
    revalidatePath('/fittrack/plan')
    return { ok: true as const }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false as const, message: msg }
  }
}
