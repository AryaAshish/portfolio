import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from './hash'

describe('hashPassword / verifyPassword', () => {
  it('roundtrips a password', async () => {
    const hash = await hashPassword('correct-horse-battery-staple')
    expect(hash).toMatch(/^\$2[aby]\$/)
    expect(await verifyPassword('correct-horse-battery-staple', hash)).toBe(true)
  })

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('secret123')
    expect(await verifyPassword('secret124', hash)).toBe(false)
  })

  it('rejects empty password on verify', async () => {
    const hash = await hashPassword('foo')
    expect(await verifyPassword('', hash)).toBe(false)
  })

  it('throws on empty password when hashing', async () => {
    await expect(hashPassword('')).rejects.toThrow('Password is required')
  })

  it('rejects with malformed hash', async () => {
    expect(await verifyPassword('foo', 'not-a-hash')).toBe(false)
  })
})
