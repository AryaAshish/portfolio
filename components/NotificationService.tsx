'use client'

import { useEffect } from 'react'
import { checkUpcomingEvents } from '@/lib/notifications'

export function NotificationService() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return
    }

    if (Notification.permission !== 'granted') {
      return
    }

    const checkEvents = async () => {
      await checkUpcomingEvents()
    }

    checkEvents()

    const interval = setInterval(checkEvents, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return null
}

