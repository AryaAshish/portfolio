export type WeightInput = {
  date: string
  weight_kg: number
  body_fat_pct?: number
  notes?: string
}

export type WeightInputError = { field: string; message: string }

export function normalizeWeightInput(raw: {
  date?: string
  weight_kg?: string
  body_fat_pct?: string
  notes?: string
}): { ok: true; data: WeightInput } | { ok: false; errors: WeightInputError[] } {
  const errors: WeightInputError[] = []

  const date = (raw.date ?? '').trim()
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push({ field: 'date', message: 'Valid date is required' })
  }

  const weightStr = (raw.weight_kg ?? '').trim()
  const weight = Number(weightStr)
  if (!weightStr || isNaN(weight) || weight <= 0) {
    errors.push({ field: 'weight_kg', message: 'Weight must be a positive number' })
  } else if (weight > 500) {
    errors.push({ field: 'weight_kg', message: 'Weight seems unrealistic' })
  }

  let bodyFat: number | undefined
  const bfStr = (raw.body_fat_pct ?? '').trim()
  if (bfStr) {
    const bf = Number(bfStr)
    if (isNaN(bf) || bf < 1 || bf > 70) {
      errors.push({ field: 'body_fat_pct', message: 'Body fat must be between 1% and 70%' })
    } else {
      bodyFat = Math.round(bf * 10) / 10
    }
  }

  if (errors.length > 0) return { ok: false, errors }

  return {
    ok: true,
    data: {
      date,
      weight_kg: Math.round(weight * 100) / 100,
      ...(bodyFat !== undefined && { body_fat_pct: bodyFat }),
      ...((raw.notes ?? '').trim() && { notes: (raw.notes ?? '').trim() }),
    },
  }
}
