import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; topicId: string; questionId: string } }
) {
  try {
    const body = await request.json()
    const question = await db.prepQuestions.update(params.questionId, body)
    return NextResponse.json({ success: true, question })
  } catch (error: any) {
    console.error('Error updating question:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; topicId: string; questionId: string } }
) {
  try {
    await db.prepQuestions.delete(params.questionId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting question:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

