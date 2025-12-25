import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await db.planner.calendar.getById(params.id)
    
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, event })
  } catch (error: any) {
    console.error('Error fetching calendar event:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const event = await db.planner.calendar.update(params.id, {
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      allDay: data.allDay,
      eventType: data.eventType,
      color: data.color,
      location: data.location,
      recurringPattern: data.recurringPattern,
      recurringUntil: data.recurringUntil,
    })

    return NextResponse.json({ success: true, event })
  } catch (error: any) {
    console.error('Error updating calendar event:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.planner.calendar.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting calendar event:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete event' }, { status: 500 })
  }
}


