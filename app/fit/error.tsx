'use client'

export default function FitError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f7f7f5' }}>
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>
          Something went wrong
        </h2>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={reset}
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: '#2563eb', color: '#ffffff' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
