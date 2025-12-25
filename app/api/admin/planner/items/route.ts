import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const priority = searchParams.get('priority') || undefined
    const type = searchParams.get('type') || undefined

    const items = await db.planner.items.getAll({
      status: status as 'active' | 'completed' | 'archived' | undefined,
      priority: priority as 'low' | 'medium' | 'high' | 'urgent' | undefined,
      type: type as 'note' | 'todo' | 'reminder' | 'goal' | 'idea' | undefined,
    })
    return NextResponse.json({ success: true, items })
  } catch (error: any) {
    console.error('Error fetching important items:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.title) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 })
    }

    const item = await db.planner.items.create({
      title: data.title,
      description: data.description,
      type: data.type || 'note',
      priority: data.priority || 'medium',
      status: data.status || 'active',
      dueDate: data.dueDate,
      tags: data.tags || [],
    })

    return NextResponse.json({ success: true, item })
  } catch (error: any) {
    console.error('Error creating important item:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create item' }, { status: 500 })
  }
}


