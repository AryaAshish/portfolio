'use client'

export default function FitTrackError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-6"
      style={{ background: '#f7f7f5', fontFamily: 'Inter, sans-serif' }}
    >
      <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-2">
        FitTrack
      </p>
      <h1 className="font-bold text-lg text-[#1a1a1a] mb-2 text-center">
        Something went wrong
      </h1>
      <p className="text-sm text-[#666] text-center max-w-md mb-6">
        {error.message ||
          'Could not load this section. Check your connection and FitTrack env vars.'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg border border-[#e8e8e4] bg-white px-4 py-2 text-sm font-semibold text-[#1a1a1a] hover:bg-[#fafafa]"
      >
        Try again
      </button>
    </div>
  )
}
