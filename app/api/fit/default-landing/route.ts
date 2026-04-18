import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { enabled } = await req.json()
  const res = NextResponse.json({ ok: true })

  if (enabled) {
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
