import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  let body: { enabled?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const isProduction = process.env.NODE_ENV === 'production'
  if (body.enabled) {
    cookies().set('ft_default_landing', '1', {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
    })
  } else {
    cookies().set('ft_default_landing', '', { path: '/', maxAge: 0 })
  }

  return NextResponse.json({ ok: true, enabled: !!body.enabled })
}
