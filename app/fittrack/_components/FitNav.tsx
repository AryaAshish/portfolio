'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/fittrack',           label: 'Overview'  },
  { href: '/fittrack/calendar',  label: 'Calendar'  },
  { href: '/fittrack/progress',  label: 'Progress'  },
  { href: '/fittrack/workouts',  label: 'Workouts'  },
  { href: '/fittrack/meals',     label: 'Meals'     },
  { href: '/fittrack/health',    label: 'Health'    },
]

export function FitNav() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-[#e8e8e4] flex-shrink-0">
      {/* Top bar */}
      <div className="px-4 pt-4 pb-0 flex items-baseline gap-3">
        <span className="font-grotesk text-[13px] font-semibold text-[#1a1a1a] tracking-tight">
          FitTrack
        </span>
        <span className="text-[11px] text-[#999]">Ashish · 3-month plan</span>
      </div>

      {/* Tab bar */}
      <nav className="flex overflow-x-auto scrollbar-none">
        {TABS.map(({ href, label }) => {
          const isActive =
            href === '/fittrack'
              ? pathname === '/fittrack'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className="flex-shrink-0 px-4 py-3 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap"
              style={{
                color: isActive ? '#2563eb' : '#999',
                borderBottomColor: isActive ? '#2563eb' : 'transparent',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
