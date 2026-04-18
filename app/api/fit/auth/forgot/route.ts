import { NextRequest, NextResponse } from 'next/server'
import { createFitPublicRouteClient } from '@/lib/fit-public/client-route'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 })
    }

    const supabase = createFitPublicRouteClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://musafir.codes'

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/fit/auth/callback`,
    })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
