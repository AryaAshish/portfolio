'use client'

import { useState, useEffect, useRef } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return true
      }
      if ((window.navigator as any).standalone) {
        setIsInstalled(true)
        return true
      }
      return false
    }

    if (checkIfInstalled()) return

    const handler = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      promptRef.current = promptEvent
      setDeferredPrompt(promptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    setTimeout(() => {
      if (!checkIfInstalled() && !localStorage.getItem('pwa-install-dismissed')) {
        if (promptRef.current) {
          setShowPrompt(true)
        }
      }
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('Install prompt not available. Showing manual instructions.')
      alert('To install this app:\n\nChrome/Edge: Click the install icon in the address bar\nSafari (iOS): Tap Share > Add to Home Screen\nFirefox: Menu > Install')
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setIsInstalled(true)
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Error showing install prompt:', error)
      alert('Unable to show install prompt. Please use your browser&apos;s menu to install this app.')
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (isInstalled || !showPrompt) {
    return null
  }

  const hasInstallPrompt = deferredPrompt !== null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-ocean-deep text-neutral-white rounded-lg shadow-2xl p-6 border-2 border-ocean-pale">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-teal-base" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg font-bold mb-1">Install Portfolio App</h3>
            <p className="text-sm text-ocean-pale mb-4">
              {hasInstallPrompt 
                ? 'Add to your home screen for quick access and notifications'
                : 'Install this app for quick access and notifications'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasInstallPrompt}
              >
                {hasInstallPrompt ? 'Install' : 'How to Install'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-transparent border border-ocean-pale text-ocean-pale rounded-lg font-medium hover:bg-ocean-pale/20 transition-colors"
              >
                Not now
              </button>
            </div>
            {!hasInstallPrompt && (
              <p className="text-xs text-ocean-pale mt-2">
                Look for the install icon in your browser&apos;s address bar
              </p>
            )}
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

