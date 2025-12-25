import { NextRequest, NextResponse } from 'next/server'
import { suggestRelatedTopics } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { title, content, existingTopics } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      )
    }

    const topics = await suggestRelatedTopics(title, content, existingTopics || [])
    return NextResponse.json({ success: true, topics })
  } catch (error: any) {
    console.error('Error suggesting topics:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to suggest topics' },
      { status: 500 }
    )
  }
}


