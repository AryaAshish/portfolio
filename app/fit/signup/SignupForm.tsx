'use client'

import { useState } from 'react'
import Link from 'next/link'

export function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
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
      const res = await fetch('/api/fit/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()

      if (!data.ok) {
        setError(data.error || 'Signup failed')
        setPending(false)
        return
      }

      setPending(false)
      window.location.href = '/fit?first=1'
    } catch {
      setError('Network error. Please try again.')
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="w-full rounded-lg px-4 py-3 text-sm"
          style={{ background: '#ffffff', border: '1px solid #e8e8e4', color: '#1a1a1a' }}
          disabled={pending}
        />
      </div>
      <div>
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
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 characters)"
          required
          minLength={8}
          className="w-full rounded-lg px-4 py-3 text-sm"
          style={{ background: '#ffffff', border: '1px solid #e8e8e4', color: '#1a1a1a' }}
          disabled={pending}
        />
      </div>

      {error && (
        <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg px-4 py-3 text-sm font-medium disabled:opacity-50"
        style={{ background: '#2563eb', color: '#ffffff' }}
      >
        {pending ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-xs" style={{ color: '#6b7280' }}>
        Already have an account?{' '}
        <Link href="/fit/login" className="hover:underline" style={{ color: '#2563eb' }}>
          Sign in
        </Link>
      </p>
    </form>
  )
}
