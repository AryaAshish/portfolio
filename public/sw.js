const CACHE_NAME = 'portfolio-v1'
const RUNTIME_CACHE = 'portfolio-runtime-v1'

const STATIC_ASSETS = [
  '/',
  '/blog',
  '/about',
  '/contact',
  '/experience',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
          })
          .map((cacheName) => caches.delete(cacheName))
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type !== 'error') {
            const responseToCache = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache).catch(() => {
                // Ignore cache errors
              })
            }).catch(() => {
              // Ignore cache errors
            })
          }
          return response
        }).catch(() => {
          // Return network error, don't cache
          return new Response('Network error', { status: 408 })
        })
      }).catch(() => {
        // If cache match fails, try network
        return fetch(event.request).catch(() => {
          return new Response('Offline', { status: 503 })
        })
      })
    )
  }
})

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Portfolio Notification'
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/logiimg.jpg',
    badge: '/logiimg.jpg',
    tag: data.tag || 'notification',
    data: data.data || {},
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const data = event.notification.data
  const urlToOpen = data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, scheduledTime, tag, url } = event.data
    const delay = scheduledTime - Date.now()
    
    if (delay > 0) {
      setTimeout(() => {
        self.registration.showNotification(title, {
          body,
          icon: '/logiimg.jpg',
          badge: '/logiimg.jpg',
          tag,
          data: { url },
        })
      }, delay)
    }
  }
})

