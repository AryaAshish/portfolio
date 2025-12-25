import { NextRequest, NextResponse } from 'next/server'
import { optimizeSEO } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      )
    }

    const seoData = await optimizeSEO(title, content)
    return NextResponse.json({ success: true, ...seoData })
  } catch (error: any) {
    console.error('Error optimizing SEO:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to optimize SEO' },
      { status: 500 }
    )
  }
}


