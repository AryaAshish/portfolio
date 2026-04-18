import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let body: { enabled?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body.enabled !== 'boolean') {
    return NextResponse.json({ ok: false, error: 'enabled (boolean) is required' }, { status: 400 })
  }

  const res = NextResponse.json({ ok: true })

  if (body.enabled) {
    res.cookies.set('fit_default_landing', '1', {
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: false,
      sameSite: 'lax',
    })
  } else {
    res.cookies.set('fit_default_landing', '', { maxAge: 0, path: '/' })
  }

  return res
}
