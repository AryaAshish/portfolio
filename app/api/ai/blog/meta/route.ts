import { NextRequest, NextResponse } from 'next/server'
import { generateMetaDescription } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      )
    }

    const metaDescription = await generateMetaDescription(title, content)
    return NextResponse.json({ success: true, metaDescription })
  } catch (error: any) {
    console.error('Error generating meta description:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to generate meta description' },
      { status: 500 }
    )
  }
}


