import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await db.planner.items.getById(params.id)
    
    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, item })
  } catch (error: any) {
    console.error('Error fetching important item:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch item' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const item = await db.planner.items.update(params.id, {
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate,
      tags: data.tags,
    })

    return NextResponse.json({ success: true, item })
  } catch (error: any) {
    console.error('Error updating important item:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.planner.items.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting important item:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete item' }, { status: 500 })
  }
}


