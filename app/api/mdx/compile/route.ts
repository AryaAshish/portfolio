import { NextRequest, NextResponse } from 'next/server'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      )
    }

    const evaluateOptions: any = {
      ...runtime,
      development: false,
      format: 'mdx',
    }

    const result = await evaluate(content, evaluateOptions)

    return NextResponse.json({
      success: true,
      compiled: typeof result.default !== 'undefined' ? 'success' : 'no-default',
    })
  } catch (error: any) {
    console.error('MDX compilation error on server:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to compile MDX',
        error: {
          name: error.name,
          stack: error.stack,
        },
      },
      { status: 500 }
    )
  }
}

