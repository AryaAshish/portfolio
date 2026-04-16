'use server'

import { revalidatePath } from 'next/cache'
import { updateWeeklyGymTarget } from '@/lib/fittrack-supabase'

export async function updateWeeklyTargetAction(
  target: number
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!Number.isFinite(target)) {
    return { ok: false, message: 'Invalid target' }
  }
  const t = Math.max(0, Math.min(7, Math.floor(target)))
  try {
    await updateWeeklyGymTarget(t)
    revalidatePath('/fittrack')
    revalidatePath('/fittrack/body')
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, message: msg }
  }
}
