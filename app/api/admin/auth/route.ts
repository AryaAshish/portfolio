import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { findUserByCredentials } from '@/lib/auth/lookup'
import { signCookie, defaultExpiryMs } from '@/lib/auth/cookie'

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const username = (body.username ?? '').trim()
  const password = body.password ?? ''
  if (!username || !password) {
    return NextResponse.json(
      { ok: false, message: 'Username and password are required' },
      { status: 400 }
    )
  }

  const user = await findUserByCredentials(username, password)
  if (!user) {
    return NextResponse.json(
      { ok: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  }

  const exp = defaultExpiryMs()
  const raw = await signCookie({ userId: user.id, role: user.role, exp })
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieName = user.role === 'admin' ? 'admin_session' : 'ft_session'
  cookies().set(cookieName, raw, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 90 * 24 * 60 * 60,
  })

  const redirect = user.role === 'admin' ? '/admin' : '/fittrack?first=1'
  return NextResponse.json({ ok: true, role: user.role, redirect })
}
