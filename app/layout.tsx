import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { NotificationPermission } from '@/components/NotificationPermission'
import { NotificationService } from '@/components/NotificationService'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Portfolio | Engineer by craft. Diver by soul. Rider by heart.',
    template: '%s | Portfolio',
  },
  description: 'Android • Backend • Systems • Writing • Travel • Scuba • Motorcycles',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logiimg.jpg', sizes: '32x32' },
    ],
    shortcut: '/logiimg.jpg',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Portfolio',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ServiceWorkerRegistration />
        <NotificationService />
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <PWAInstallPrompt />
        <NotificationPermission />
      </body>
    </html>
  )
}

