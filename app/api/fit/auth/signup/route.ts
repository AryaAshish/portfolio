import { NextRequest, NextResponse } from 'next/server'
import { createFitPublicRouteClient } from '@/lib/fit-public/client-route'
import { getFitPublicAdmin } from '@/lib/fit-public/admin'

const DEFAULT_PHASES = [
  { phase_number: 1, name: 'Foundation', start_date: '2026-04-14', end_date: '2026-05-11', focus: 'Establish training habit' },
  { phase_number: 2, name: 'Build', start_date: '2026-05-12', end_date: '2026-06-08', focus: 'Progressive overload' },
  { phase_number: 3, name: 'Peak', start_date: '2026-06-09', end_date: '2026-07-06', focus: 'Strength maintenance' },
]

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password are required' }, { status: 400 })
    }

    if (typeof password === 'string' && password.length < 8) {
      return NextResponse.json({ ok: false, error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const supabase = createFitPublicRouteClient()
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      return NextResponse.json({ ok: false, error: signUpError.message }, { status: 400 })
    }

    const userId = signUpData.user?.id
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Signup failed — no user ID returned' }, { status: 500 })
    }

    const admin = getFitPublicAdmin()

    try {
      const db = admin as any
      const { error: profileError } = await db
        .from('user_profile')
        .insert({ user_id: userId, name: (name || 'User').trim().slice(0, 100) })

      if (profileError) throw profileError

      const phases = DEFAULT_PHASES.map((p) => ({ ...p, user_id: userId }))
      const { error: phasesError } = await db.from('plan_phases').insert(phases)

      if (phasesError) throw phasesError
    } catch (seedErr) {
      console.error(seedErr)
      try {
        await admin.auth.admin.deleteUser(userId)
      } catch (deleteErr) {
        console.error(deleteErr)
      }
      await supabase.auth.signOut()
      return NextResponse.json({ ok: false, error: 'Account setup failed. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
