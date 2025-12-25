import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PrepPath } from '@/types'

export async function GET() {
  try {
    const paths = await db.prepPaths.getAll()
    return NextResponse.json({ success: true, paths })
  } catch (error: any) {
    console.error('Error fetching prep paths:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, icon, color, category, difficulty, estimatedTime, published, order } = body

    if (!title || !description || !category || !difficulty) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const path = await db.prepPaths.create({
      title,
      description,
      icon: icon || undefined,
      color: color || '#14a085',
      category,
      difficulty,
      estimatedTime: estimatedTime || undefined,
      published: published || false,
      order: order || 0,
    })

    return NextResponse.json({ success: true, path })
  } catch (error: any) {
    console.error('Error creating prep path:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

