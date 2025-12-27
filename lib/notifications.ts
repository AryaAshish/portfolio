export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }

  return await Notification.requestPermission()
}

export async function scheduleEventNotification(
  title: string,
  body: string,
  scheduledTime: Date,
  tag?: string,
  url?: string
) {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    return false
  }

  if (Notification.permission !== 'granted') {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    
    if ('showNotification' in registration) {
      const delay = scheduledTime.getTime() - Date.now()
      
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          registration.showNotification(title, {
            body,
            icon: '/logiimg.jpg',
            badge: '/logiimg.jpg',
            tag: tag || 'event',
            data: { url: url || '/' },
            requireInteraction: false,
          })
        }, delay)
        return true
      }
    }
  } catch (error) {
    console.error('Error scheduling notification:', error)
  }

  return false
}

export async function checkUpcomingEvents() {
  try {
    const response = await fetch('/api/notifications/upcoming-events')
    const data = await response.json()

    if (data.success && data.events && data.events.length > 0) {
      const now = new Date()
      const notificationTime = 15 * 60 * 1000
      
      for (const event of data.events) {
        const eventDate = new Date(event.startDate)
        const timeUntilEvent = eventDate.getTime() - now.getTime()
        
        if (timeUntilEvent > 0 && timeUntilEvent < 60 * 60 * 1000) {
          const minutesUntil = Math.floor(timeUntilEvent / (60 * 1000))
          
          if (minutesUntil <= 15 && minutesUntil > 0) {
            const notificationScheduledTime = new Date(eventDate.getTime() - notificationTime)
            const timeUntilNotification = notificationScheduledTime.getTime() - now.getTime()
            
            if (timeUntilNotification <= 0) {
              await sendNotification(
                `Upcoming: ${event.title}`,
                `Starts in ${minutesUntil} minute${minutesUntil > 1 ? 's' : ''}`,
                {
                  tag: `event-${event.id}`,
                  data: { url: '/admin/planner/calendar' },
                }
              )
            } else {
              await scheduleEventNotification(
                `Upcoming: ${event.title}`,
                `Starts in 15 minutes`,
                notificationScheduledTime,
                `event-${event.id}`,
                '/admin/planner/calendar'
              )
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking upcoming events:', error)
  }
}

export async function sendNotification(
  title: string,
  body: string,
  options?: NotificationOptions
) {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    return false
  }

  if (Notification.permission !== 'granted') {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    await registration.showNotification(title, {
      body,
      icon: '/logiimg.jpg',
      badge: '/logiimg.jpg',
      ...options,
    })
    return true
  } catch (error) {
    console.error('Error sending notification:', error)
    return false
  }
}

