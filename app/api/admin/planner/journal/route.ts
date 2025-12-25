import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    const entries = await db.planner.journal.getAll(startDate, endDate)
    return NextResponse.json({ success: true, entries })
  } catch (error: any) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch entries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.date || !data.content) {
      return NextResponse.json({ success: false, message: 'Date and content are required' }, { status: 400 })
    }

    const entry = await db.planner.journal.create({
      date: data.date,
      title: data.title,
      content: data.content,
      mood: data.mood,
      tags: data.tags || [],
      weather: data.weather,
      location: data.location,
    })

    return NextResponse.json({ success: true, entry })
  } catch (error: any) {
    console.error('Error creating journal entry:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create entry' }, { status: 500 })
  }
}


