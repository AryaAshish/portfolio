import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { signCookie, verifyCookie, defaultExpiryMs } from './cookie'
import type { AuthSession } from './types'

const ORIGINAL = process.env.AUTH_COOKIE_SECRET

function session(overrides: Partial<AuthSession> = {}): AuthSession {
  return {
    userId: 'user-123',
    role: 'fittrack',
    exp: Date.now() + 60_000,
    ...overrides,
  }
}

describe('signCookie / verifyCookie', () => {
  beforeEach(() => {
    process.env.AUTH_COOKIE_SECRET = 'test-secret-32-bytes-long-abcdef'
  })

  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.AUTH_COOKIE_SECRET
    else process.env.AUTH_COOKIE_SECRET = ORIGINAL
  })

  it('signs and verifies a valid session', async () => {
    const s = session()
    const raw = await signCookie(s)
    const verified = await verifyCookie(raw)
    expect(verified).not.toBeNull()
    expect(verified?.userId).toBe(s.userId)
    expect(verified?.role).toBe(s.role)
    expect(verified?.exp).toBe(s.exp)
  })

  it('rejects a tampered payload', async () => {
    const raw = await signCookie(session())
    const [payload, sig] = raw.split('.')
    const tampered = `${payload}XX.${sig}`
    expect(await verifyCookie(tampered)).toBeNull()
  })

  it('rejects a tampered signature', async () => {
    const raw = await signCookie(session())
    const [payload, sig] = raw.split('.')
    const tampered = `${payload}.${sig.slice(0, -2)}AA`
    expect(await verifyCookie(tampered)).toBeNull()
  })

  it('rejects an expired session', async () => {
    const s = session({ exp: Date.now() - 1 })
    const raw = await signCookie(s)
    expect(await verifyCookie(raw)).toBeNull()
  })

  it('rejects a session signed with a different secret', async () => {
    const s = session()
    const raw = await signCookie(s)
    process.env.AUTH_COOKIE_SECRET = 'different-secret-value-32-bytes!'
    expect(await verifyCookie(raw)).toBeNull()
  })

  it('returns null when secret is missing on verify', async () => {
    const raw = await signCookie(session())
    delete process.env.AUTH_COOKIE_SECRET
    expect(await verifyCookie(raw)).toBeNull()
  })

  it('throws when secret is missing on sign', async () => {
    delete process.env.AUTH_COOKIE_SECRET
    await expect(signCookie(session())).rejects.toThrow('AUTH_COOKIE_SECRET is not set')
  })

  it('returns null for empty input', async () => {
    expect(await verifyCookie('')).toBeNull()
    expect(await verifyCookie(null)).toBeNull()
    expect(await verifyCookie(undefined)).toBeNull()
  })

  it('returns null for malformed cookie (no dot)', async () => {
    expect(await verifyCookie('abcdef')).toBeNull()
  })

  it('rejects payload with invalid role', async () => {
    const s = { userId: 'u', role: 'hacker', exp: Date.now() + 1000 }
    const raw = await signCookie(s as unknown as AuthSession)
    expect(await verifyCookie(raw)).toBeNull()
  })
})

describe('defaultExpiryMs', () => {
  it('returns a timestamp roughly 90 days in the future', () => {
    const now = Date.now()
    const exp = defaultExpiryMs()
    const days = (exp - now) / (24 * 60 * 60 * 1000)
    expect(days).toBeGreaterThan(89.9)
    expect(days).toBeLessThan(90.1)
  })
})
