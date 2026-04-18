'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createFitPublicBrowserClient } from '@/lib/fit-public/client-browser'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setPending(true)

    try {
      const supabase = createFitPublicBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setError(updateError.message)
        setPending(false)
        return
      }

      router.replace('/fit')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f7f7f5' }}>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6" style={{ color: '#1a1a1a' }}>
          Set a new password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 8 characters)"
            required
            minLength={8}
            className="w-full rounded-lg px-4 py-3 text-sm"
            style={{ background: '#ffffff', border: '1px solid #e8e8e4', color: '#1a1a1a' }}
            disabled={pending}
          />
          {error && (
            <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg px-4 py-3 text-sm font-medium disabled:opacity-50"
            style={{ background: '#2563eb', color: '#ffffff' }}
          >
            {pending ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
