import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const topic = await db.prepTopics.create({
      prepPathId: params.id,
      title: body.title,
      description: body.description || undefined,
      order: body.order || 0,
    })
    return NextResponse.json({ success: true, topic })
  } catch (error: any) {
    console.error('Error creating topic:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

