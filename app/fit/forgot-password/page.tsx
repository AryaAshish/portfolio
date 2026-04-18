'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    try {
      const res = await fetch('/api/fit/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.error || 'Failed to send reset email')
      } else {
        setSent(true)
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setPending(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f7f7f5' }}>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6" style={{ color: '#1a1a1a' }}>
          Reset your password
        </h1>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm" style={{ color: '#6b7280' }}>
              If an account exists for {email}, you&apos;ll receive a reset link shortly.
            </p>
            <Link href="/fit/login" className="text-sm hover:underline" style={{ color: '#2563eb' }}>
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
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
              {pending ? 'Sending…' : 'Send reset link'}
            </button>
            <p className="text-center text-xs" style={{ color: '#6b7280' }}>
              <Link href="/fit/login" className="hover:underline">Back to login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
