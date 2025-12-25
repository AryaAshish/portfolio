import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const path = await db.prepPaths.getById(params.id)
    if (!path) {
      return NextResponse.json({ success: false, message: 'Prep path not found' }, { status: 404 })
    }

    const [topics, resources] = await Promise.all([
      db.prepTopics.getByPathId(params.id),
      db.prepResources.getByPathId(params.id),
    ])

    const topicsWithQuestions = await Promise.all(
      topics.map(async (topic) => {
        const [questions, topicResources] = await Promise.all([
          db.prepQuestions.getByTopicId(topic.id),
          db.prepResources.getByTopicId(topic.id),
        ])
        return { ...topic, questions, resources: topicResources }
      })
    )

    return NextResponse.json({
      success: true,
      path: { ...path, topics: topicsWithQuestions, resources },
    })
  } catch (error: any) {
    console.error('Error fetching prep path:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const path = await db.prepPaths.update(params.id, body)
    return NextResponse.json({ success: true, path })
  } catch (error: any) {
    console.error('Error updating prep path:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.prepPaths.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting prep path:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

