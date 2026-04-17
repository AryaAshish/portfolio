'use client'

import { useRouter } from 'next/navigation'
import { FT } from './tokens'

export function BackLink({ label = '← Back' }: { label?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-xs"
      style={{ color: FT.textMuted }}
    >
      {label}
    </button>
  )
}
