import { describe, expect, it } from 'vitest'
import { normalizeWeightInput } from './weight-input'

describe('normalizeWeightInput', () => {
  it('returns errors for empty input', () => {
    const r = normalizeWeightInput({})
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors.length).toBeGreaterThanOrEqual(2)
      expect(r.errors.map((e) => e.field)).toContain('date')
      expect(r.errors.map((e) => e.field)).toContain('weight_kg')
    }
  })

  it('returns error for negative weight', () => {
    const r = normalizeWeightInput({ date: '2026-04-16', weight_kg: '-5' })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors[0].field).toBe('weight_kg')
    }
  })

  it('returns error for non-numeric weight', () => {
    const r = normalizeWeightInput({ date: '2026-04-16', weight_kg: 'abc' })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors[0].field).toBe('weight_kg')
    }
  })

  it('rounds extra decimals to 2 places', () => {
    const r = normalizeWeightInput({ date: '2026-04-16', weight_kg: '74.256' })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data.weight_kg).toBe(74.26)
    }
  })

  it('validates body_fat_pct bounds', () => {
    const low = normalizeWeightInput({ date: '2026-04-16', weight_kg: '70', body_fat_pct: '0' })
    expect(low.ok).toBe(false)
    if (!low.ok) {
      expect(low.errors[0].field).toBe('body_fat_pct')
    }

    const high = normalizeWeightInput({ date: '2026-04-16', weight_kg: '70', body_fat_pct: '80' })
    expect(high.ok).toBe(false)
    if (!high.ok) {
      expect(high.errors[0].field).toBe('body_fat_pct')
    }

    const valid = normalizeWeightInput({ date: '2026-04-16', weight_kg: '70', body_fat_pct: '15.55' })
    expect(valid.ok).toBe(true)
    if (valid.ok) {
      expect(valid.data.body_fat_pct).toBe(15.6)
    }
  })

  it('passes valid input with optional notes', () => {
    const r = normalizeWeightInput({
      date: '2026-04-16',
      weight_kg: '74.2',
      notes: '  morning weigh-in  ',
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data).toEqual({
        date: '2026-04-16',
        weight_kg: 74.2,
        notes: 'morning weigh-in',
      })
    }
  })

  it('omits body_fat_pct and notes when empty strings', () => {
    const r = normalizeWeightInput({
      date: '2026-04-16',
      weight_kg: '70',
      body_fat_pct: '',
      notes: '  ',
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data).toEqual({ date: '2026-04-16', weight_kg: 70 })
      expect('body_fat_pct' in r.data).toBe(false)
      expect('notes' in r.data).toBe(false)
    }
  })

  it('rejects unrealistically high weight', () => {
    const r = normalizeWeightInput({ date: '2026-04-16', weight_kg: '600' })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors[0].message).toContain('unrealistic')
    }
  })

  it('rejects invalid date format', () => {
    const r = normalizeWeightInput({ date: '16-04-2026', weight_kg: '70' })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors[0].field).toBe('date')
    }
  })
})
