'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearCachePage() {
  const router = useRouter()
  const [status, setStatus] = useState<string>('')

  const clearAllCaches = async () => {
    setStatus('Clearing caches...')
    
    try {
      // Clear service worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
        setStatus(`Cleared ${cacheNames.length} cache(s)`)
      }
      
      // Unregister service worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map(reg => reg.unregister()))
        setStatus(prev => prev + '\nUnregistered service worker')
      }
      
      setStatus(prev => prev + '\n\n✅ All caches cleared! Reloading in 2 seconds...')
      
      setTimeout(() => {
        window.location.href = '/admin'
      }, 2000)
    } catch (error) {
      setStatus('❌ Error clearing caches: ' + (error as Error).message)
    }
  }

  const clearImageCache = async () => {
    setStatus('Clearing image cache...')
    
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_IMAGE_CACHE'
        })
        setStatus('✅ Image cache cleared! Refresh the page to see changes.')
      } else {
        setStatus('⚠️ Service worker not active. Try clearing all caches.')
      }
    } catch (error) {
      setStatus('❌ Error: ' + (error as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-white rounded-xl p-8 shadow-lg">
          <h1 className="font-serif text-3xl text-ocean-deep mb-6">Clear Cache</h1>
          
          <p className="text-ocean-base mb-6">
            If you're seeing old images or content after making changes, use these tools to clear the cache.
          </p>

          <div className="space-y-4">
            <button
              onClick={clearImageCache}
              className="w-full px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
            >
              Clear Image Cache Only
            </button>

            <button
              onClick={clearAllCaches}
              className="w-full px-6 py-3 bg-red-500 text-neutral-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Clear All Caches & Reload
            </button>

            <button
              onClick={() => router.push('/admin')}
              className="w-full px-6 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base hover:text-neutral-white transition-colors"
            >
              Back to Admin
            </button>
          </div>

          {status && (
            <div className="mt-6 p-4 bg-ocean-pale/10 rounded-lg">
              <pre className="text-sm text-ocean-deep whitespace-pre-wrap">{status}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
