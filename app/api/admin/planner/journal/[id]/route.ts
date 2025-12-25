import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const entry = await db.planner.journal.getById(params.id)
    
    if (!entry) {
      return NextResponse.json({ success: false, message: 'Entry not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, entry })
  } catch (error: any) {
    console.error('Error fetching journal entry:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch entry' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const entry = await db.planner.journal.update(params.id, {
      date: data.date,
      title: data.title,
      content: data.content,
      mood: data.mood,
      tags: data.tags,
      weather: data.weather,
      location: data.location,
    })

    return NextResponse.json({ success: true, entry })
  } catch (error: any) {
    console.error('Error updating journal entry:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to update entry' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.planner.journal.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting journal entry:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete entry' }, { status: 500 })
  }
}


