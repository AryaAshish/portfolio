import type { Metadata } from 'next'
import { createFitPublicServerClient } from '@/lib/fit-public/client-server'
import { redirect } from 'next/navigation'
import { SignupForm } from './SignupForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Sign up · FitTrack' }

export default async function FitSignupPage() {
  try {
    const supabase = createFitPublicServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect('/fit')
  } catch {
    // env vars may not be set; render the form anyway
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f7f7f5' }}>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6" style={{ color: '#1a1a1a' }}>
          Create your FitTrack account
        </h1>
        <SignupForm />
      </div>
    </div>
  )
}
