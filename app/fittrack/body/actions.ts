'use server'

import { upsertWeight, updateWeeklyGymTarget } from '@/lib/fittrack-supabase'
import { normalizeWeightInput } from '@/lib/fittrack/weight-input'

export async function logWeightAction(formData: FormData) {
  const raw = {
    date: formData.get('date') as string | undefined,
    weight_kg: formData.get('weight_kg') as string | undefined,
    body_fat_pct: formData.get('body_fat_pct') as string | undefined,
    notes: formData.get('notes') as string | undefined,
  }

  const result = normalizeWeightInput(raw)
  if (!result.ok) {
    return { ok: false as const, errors: result.errors }
  }

  try {
    await upsertWeight(result.data)
    return { ok: true as const }
  } catch (err) {
    console.error(err)
    return {
      ok: false as const,
      errors: [{ field: '_form', message: 'Failed to save. Please try again.' }],
    }
  }
}

export async function updateWeeklyTargetAction(
  target: number
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await updateWeeklyGymTarget(target)
    return { ok: true }
  } catch (err) {
    console.error(err)
    return { ok: false, message: 'Failed to update target.' }
  }
}
