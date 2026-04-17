import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const setCookie = vi.fn()

vi.mock('@/lib/auth/lookup', () => ({
  findUserByCredentials: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: () => ({ set: setCookie }),
}))

const ORIGINAL_SECRET = process.env.AUTH_COOKIE_SECRET

async function callPost(body: unknown) {
  const { POST } = await import('@/app/api/admin/auth/route')
  const req = new NextRequest('http://localhost:3000/api/admin/auth', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
  const res = await POST(req)
  const data = await res.json().catch(() => null)
  return { res, data }
}

describe('POST /api/admin/auth', () => {
  beforeEach(() => {
    process.env.AUTH_COOKIE_SECRET = 'test-secret-xxxxxxxxxxxxxxxxxxxxxxxx'
    setCookie.mockReset()
  })

  afterEach(() => {
    vi.resetAllMocks()
    vi.resetModules()
    if (ORIGINAL_SECRET === undefined) delete process.env.AUTH_COOKIE_SECRET
    else process.env.AUTH_COOKIE_SECRET = ORIGINAL_SECRET
  })

  it('returns 200 with admin session cookie on valid admin creds', async () => {
    const { findUserByCredentials } = await import('@/lib/auth/lookup')
    ;(findUserByCredentials as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'user-admin',
      role: 'admin',
    })

    const { res, data } = await callPost({ username: 'adminaryan', password: 'pw' })

    expect(res.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.role).toBe('admin')
    expect(data.redirect).toBe('/admin')
    expect(setCookie).toHaveBeenCalledWith(
      'admin_session',
      expect.any(String),
      expect.objectContaining({ httpOnly: true, path: '/' })
    )
  })

  it('returns 200 with ft_session cookie + first-login redirect on fittrack creds', async () => {
    const { findUserByCredentials } = await import('@/lib/auth/lookup')
    ;(findUserByCredentials as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'user-ft',
      role: 'fittrack',
    })

    const { res, data } = await callPost({ username: 'rickyaryan', password: 'pw' })

    expect(res.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(data.role).toBe('fittrack')
    expect(data.redirect).toBe('/fittrack?first=1')
    expect(setCookie).toHaveBeenCalledWith(
      'ft_session',
      expect.any(String),
      expect.objectContaining({ httpOnly: true, path: '/' })
    )
  })

  it('returns 401 for invalid credentials', async () => {
    const { findUserByCredentials } = await import('@/lib/auth/lookup')
    ;(findUserByCredentials as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    const { res, data } = await callPost({ username: 'nope', password: 'bad' })

    expect(res.status).toBe(401)
    expect(data.ok).toBe(false)
    expect(data.message).toBe('Invalid credentials')
    expect(setCookie).not.toHaveBeenCalled()
  })

  it('returns 400 when username is missing', async () => {
    const { res, data } = await callPost({ password: 'pw' })
    expect(res.status).toBe(400)
    expect(data.ok).toBe(false)
  })

  it('returns 400 when password is missing', async () => {
    const { res, data } = await callPost({ username: 'user' })
    expect(res.status).toBe(400)
    expect(data.ok).toBe(false)
  })

  it('returns 400 on malformed JSON body', async () => {
    const { POST } = await import('@/app/api/admin/auth/route')
    const req = new NextRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      body: '{not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
