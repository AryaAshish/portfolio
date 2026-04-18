import type { Metadata } from 'next'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { Space_Grotesk, Inter } from 'next/font/google'
import { FitNav } from '@/app/fittrack/_components/FitNav'
import { FirstLoginModal } from './_components/FirstLoginModal'
import { LogoutButton } from './_components/LogoutButton'
import { FT } from '@/app/fittrack/_components/tokens'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-fit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FitTrack',
    template: '%s · FitTrack',
  },
  description: 'Personal fitness tracker',
}

const AUTH_PATHS = ['/fit/login', '/fit/signup', '/fit/forgot-password', '/fit/reset-password']

export default function FitPublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const pathname = headersList.get('x-fit-pathname') || ''
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (isAuthPage) {
    return (
      <div
        className={`${spaceGrotesk.variable} ${inter.variable}`}
        style={{ background: FT.canvas, fontFamily: 'var(--font-inter-fit), Inter, sans-serif' }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={`${spaceGrotesk.variable} ${inter.variable} fixed inset-0 z-50 flex flex-col`}
      style={{ background: FT.canvas, fontFamily: 'var(--font-inter-fit), Inter, sans-serif' }}
    >
      <header
        className="flex-shrink-0 px-4 py-3 flex items-baseline gap-2"
        style={{ borderBottom: `1px solid ${FT.border}`, background: FT.surface }}
      >
        <span className="font-grotesk text-[13px] font-semibold tracking-tight" style={{ color: FT.textPrimary }}>
          FitTrack
        </span>
        <LogoutButton />
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5">
          {children}
        </div>
      </div>
      <FitNav basePath="/fit" />
      <Suspense fallback={null}>
        <FirstLoginModal />
      </Suspense>
    </div>
  )
}
