'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FT } from './tokens'

type TabDef = {
  path: string
  label: string
  icon: (active: boolean) => React.ReactNode
}

const TAB_DEFS: TabDef[] = [
  {
    path: '',
    label: 'Today',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? FT.accent : FT.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    path: '/train',
    label: 'Train',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? FT.accent : FT.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5a2 2 0 0 1 3 0l0 11a2 2 0 0 1-3 0z" />
        <path d="M14.5 6.5a2 2 0 0 1 3 0l0 11a2 2 0 0 1-3 0z" />
        <path d="M4 12h16" />
      </svg>
    ),
  },
  {
    path: '/body',
    label: 'Body',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? FT.accent : FT.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.77L12 20.65l7.65-7.65.77-.77a5.4 5.4 0 0 0 0-7.65z" />
      </svg>
    ),
  },
]

export function FitNav({ basePath = '/fittrack' }: { basePath?: '/fittrack' | '/fit' }) {
  const pathname = usePathname()

  return (
    <nav
      className="flex-shrink-0 flex items-stretch justify-around border-t"
      style={{
        background: FT.surface,
        borderColor: FT.border,
        height: 56,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {TAB_DEFS.map(({ path, label, icon }) => {
        const href = basePath + path
        const isActive =
          path === ''
            ? pathname === basePath
            : pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors"
          >
            {icon(isActive)}
            <span
              className="text-[10px] font-semibold"
              style={{ color: isActive ? FT.accent : FT.textMuted }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
