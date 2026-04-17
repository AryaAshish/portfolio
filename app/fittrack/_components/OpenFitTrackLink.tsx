import Link from 'next/link'

export function OpenFitTrackLink() {
  return (
    <Link
      href="/fittrack"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-base text-neutral-white text-sm font-medium hover:bg-teal-dark transition-colors shadow-lg"
    >
      Open FitTrack
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
