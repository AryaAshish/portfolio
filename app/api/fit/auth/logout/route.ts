import { NextResponse } from 'next/server'
import { createFitPublicRouteClient } from '@/lib/fit-public/client-route'

export async function POST() {
  try {
    const supabase = createFitPublicRouteClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
    const res = NextResponse.json({ ok: true })
    res.cookies.set('fit_default_landing', '', { maxAge: 0, path: '/' })
    return res
  } catch {
    return NextResponse.json({ ok: false, error: 'Logout failed' }, { status: 500 })
  }
}
