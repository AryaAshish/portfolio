import { NextRequest, NextResponse } from 'next/server'
import { generateBlogOutline } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { topic, style } = await request.json()

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Topic is required' },
        { status: 400 }
      )
    }

    const outline = await generateBlogOutline(topic, style)
    return NextResponse.json({ success: true, outline })
  } catch (error: any) {
    console.error('Error generating outline:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to generate outline' },
      { status: 500 }
    )
  }
}


