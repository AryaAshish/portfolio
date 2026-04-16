'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { PWAInstallPrompt } from './PWAInstallPrompt'
import { NotificationPermission } from './NotificationPermission'

export function AdminPWAPrompts() {
  const pathname = usePathname()
  const [isAdminRoute, setIsAdminRoute] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkAdminRoute = pathname?.startsWith('/admin') || false
    setIsAdminRoute(checkAdminRoute)

    const checkAuth = () => {
      if (checkAdminRoute) {
        const auth = localStorage.getItem('admin_authenticated')
        setIsAuthenticated(auth === 'true')
      } else {
        setIsAuthenticated(false)
      }
    }

    checkAuth()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_authenticated') {
        checkAuth()
      }
    }

    const handleCustomStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('admin-auth-changed', handleCustomStorageChange)

    const interval = setInterval(checkAuth, 2000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('admin-auth-changed', handleCustomStorageChange)
      clearInterval(interval)
    }
  }, [pathname])

  if (!isAdminRoute || !isAuthenticated) {
    return null
  }

  return (
    <>
      <PWAInstallPrompt />
      <NotificationPermission />
    </>
  )
}

