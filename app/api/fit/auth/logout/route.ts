import { NextResponse } from 'next/server'
import { createFitPublicRouteClient } from '@/lib/fit-public/client-route'

export async function POST() {
  const supabase = createFitPublicRouteClient()
  await supabase.auth.signOut()

  const res = NextResponse.json({ ok: true })
  res.cookies.set('fit_default_landing', '', { maxAge: 0, path: '/' })
  return res
}
