'use client'

import { usePathname } from 'next/navigation'
import { PWAInstallPrompt } from './PWAInstallPrompt'
import { NotificationPermission } from './NotificationPermission'

export function AdminPWAPrompts() {
  const pathname = usePathname()
  const onAdmin =
    typeof pathname === 'string' &&
    pathname.startsWith('/admin') &&
    pathname !== '/admin/login'

  if (!onAdmin) return null

  return (
    <>
      <PWAInstallPrompt />
      <NotificationPermission />
    </>
  )
}
