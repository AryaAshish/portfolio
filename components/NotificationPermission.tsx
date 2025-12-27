'use client'

import { useState, useEffect } from 'react'

export function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return
    }

    setPermission(Notification.permission)

    if (Notification.permission === 'default') {
      const dismissed = localStorage.getItem('notification-permission-dismissed')
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 5000)
      }
    }
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications')
      return
    }

    const result = await Notification.requestPermission()
    setPermission(result)

    if (result === 'granted') {
      setShowPrompt(false)
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        registration.showNotification('Notifications Enabled', {
          body: 'You will now receive notifications for calendar events and updates',
          icon: '/logiimg.jpg',
          badge: '/logiimg.jpg',
          tag: 'permission-granted',
        })
      }
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('notification-permission-dismissed', 'true')
  }

  if (permission === 'granted' || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div className="bg-ocean-deep text-neutral-white rounded-lg shadow-2xl p-6 border-2 border-ocean-pale">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-teal-base" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A4.032 4.032 0 0112 14.5c-2.21 0-4-1.79-4-4s1.79-4 4-4c.89 0 1.71.29 2.38.78L15 9m0 8v-4m-4 4h4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg font-bold mb-1">Enable Notifications</h3>
            <p className="text-sm text-ocean-pale mb-4">
              Get notified about upcoming calendar events and important updates
            </p>
            <div className="flex gap-2">
              <button
                onClick={requestPermission}
                className="px-4 py-2 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
              >
                Enable
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-transparent border border-ocean-pale text-ocean-pale rounded-lg font-medium hover:bg-ocean-pale/20 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-ocean-pale hover:text-neutral-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

