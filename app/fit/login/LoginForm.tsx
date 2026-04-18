'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)

    try {
      const res = await fetch('/api/fit/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!data.ok) {
        setError(data.error || 'Login failed')
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Password"
          required
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
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      <div className="flex items-center justify-between text-xs" style={{ color: '#6b7280' }}>
        <Link href="/fit/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
        <Link href="/fit/signup" className="hover:underline">
          Create account
        </Link>
      </div>
    </form>
  )
}
