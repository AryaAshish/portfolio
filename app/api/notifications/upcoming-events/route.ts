import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const startDate = now.toISOString().split('T')[0]
    const endDate = tomorrow.toISOString().split('T')[0]

    const events = await db.planner.calendar.getAll(startDate, endDate)
    
    const upcomingEvents = events
      .filter(event => {
        const eventDate = new Date(event.startDate)
        return eventDate >= now && eventDate <= tomorrow
      })
      .map(event => ({
        id: event.id,
        title: event.title,
        startDate: event.startDate,
        eventType: event.eventType,
        description: event.description,
      }))

    return NextResponse.json({ success: true, events: upcomingEvents })
  } catch (error: any) {
    console.error('Error fetching upcoming events:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

