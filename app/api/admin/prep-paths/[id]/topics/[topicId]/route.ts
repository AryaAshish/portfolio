import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; topicId: string } }
) {
  try {
    const body = await request.json()
    const topic = await db.prepTopics.update(params.topicId, body)
    return NextResponse.json({ success: true, topic })
  } catch (error: any) {
    console.error('Error updating topic:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; topicId: string } }
) {
  try {
    await db.prepTopics.delete(params.topicId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting topic:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

