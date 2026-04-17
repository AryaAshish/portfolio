import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  cookies().set('ft_session', '', { path: '/', maxAge: 0 })
  cookies().set('ft_default_landing', '', { path: '/', maxAge: 0 })
  return NextResponse.json({ ok: true })
}
