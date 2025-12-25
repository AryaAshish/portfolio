import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; topicId: string } }
) {
  try {
    const body = await request.json()
    const question = await db.prepQuestions.create({
      prepTopicId: params.topicId,
      question: body.question,
      answer: body.answer || undefined,
      difficulty: body.difficulty || 'medium',
      tags: body.tags || [],
      relatedBlogPost: body.relatedBlogPost || undefined,
      order: body.order || 0,
    })
    return NextResponse.json({ success: true, question })
  } catch (error: any) {
    console.error('Error creating question:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

