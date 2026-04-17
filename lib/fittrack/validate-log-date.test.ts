import { describe, expect, it } from 'vitest'
import { isValidLogDate } from './validate-log-date'

const TODAY = '2026-04-16'

describe('isValidLogDate', () => {
  it('accepts today', () => {
    expect(isValidLogDate(TODAY, TODAY)).toBe(true)
  })

  it('accepts a past date', () => {
    expect(isValidLogDate('2025-12-01', TODAY)).toBe(true)
  })

  it('rejects empty string', () => {
    expect(isValidLogDate('', TODAY)).toBe(false)
  })

  it('rejects malformed strings', () => {
    expect(isValidLogDate('2026/04/16', TODAY)).toBe(false)
    expect(isValidLogDate('16-04-2026', TODAY)).toBe(false)
    expect(isValidLogDate('2026-4-6', TODAY)).toBe(false)
    expect(isValidLogDate('not-a-date', TODAY)).toBe(false)
  })

  it('rejects invalid calendar dates', () => {
    expect(isValidLogDate('2026-02-30', TODAY)).toBe(false)
    expect(isValidLogDate('2026-13-01', TODAY)).toBe(false)
    expect(isValidLogDate('2026-00-10', TODAY)).toBe(false)
    expect(isValidLogDate('2025-02-29', TODAY)).toBe(false)
  })

  it('rejects future dates', () => {
    expect(isValidLogDate('2026-04-17', TODAY)).toBe(false)
    expect(isValidLogDate('2030-01-01', TODAY)).toBe(false)
  })

  it('accepts leap day in a leap year', () => {
    expect(isValidLogDate('2024-02-29', TODAY)).toBe(true)
  })

  it('ignores non-string inputs defensively', () => {
    // @ts-expect-error runtime guard
    expect(isValidLogDate(null, TODAY)).toBe(false)
    // @ts-expect-error runtime guard
    expect(isValidLogDate(undefined, TODAY)).toBe(false)
  })
})
