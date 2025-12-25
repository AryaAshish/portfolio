import { NextRequest, NextResponse } from 'next/server'
import { explainCodeSnippet } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Code is required' },
        { status: 400 }
      )
    }

    const explanation = await explainCodeSnippet(code, language)
    return NextResponse.json({ success: true, explanation })
  } catch (error: any) {
    console.error('Error explaining code:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to explain code' },
      { status: 500 }
    )
  }
}


