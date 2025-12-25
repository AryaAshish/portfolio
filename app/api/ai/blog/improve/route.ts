import { NextRequest, NextResponse } from 'next/server'
import { improveWriting } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { content, focus } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      )
    }

    const improved = await improveWriting(content, focus)
    return NextResponse.json({ success: true, improved })
  } catch (error: any) {
    console.error('Error improving writing:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to improve writing' },
      { status: 500 }
    )
  }
}


