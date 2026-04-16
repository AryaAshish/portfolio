import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { FitNav } from './_components/FitNav'

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
  description: 'Personal fitness dashboard — Ashish',
  manifest: '/fittrack-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FitTrack',
  },
}

export default function FitTrackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${spaceGrotesk.variable} ${inter.variable} fixed inset-0 z-50 flex flex-col`}
      style={{ background: '#f7f7f5', fontFamily: 'var(--font-inter-fit), Inter, sans-serif' }}
    >
      <FitNav />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
