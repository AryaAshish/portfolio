import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    const events = await db.planner.calendar.getAll(startDate, endDate)
    return NextResponse.json({ success: true, events })
  } catch (error: any) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.title || !data.startDate) {
      return NextResponse.json({ success: false, message: 'Title and start date are required' }, { status: 400 })
    }

    const event = await db.planner.calendar.create({
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      allDay: data.allDay ?? false,
      eventType: data.eventType || 'event',
      color: data.color || '#3b82f6',
      location: data.location,
      recurringPattern: data.recurringPattern || 'none',
      recurringUntil: data.recurringUntil,
    })

    return NextResponse.json({ success: true, event })
  } catch (error: any) {
    console.error('Error creating calendar event:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create event' }, { status: 500 })
  }
}


