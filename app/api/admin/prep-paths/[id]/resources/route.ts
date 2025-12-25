import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const resource = await db.prepResources.create({
      prepPathId: body.prepPathId || params.id,
      prepTopicId: body.prepTopicId || undefined,
      title: body.title,
      type: body.type,
      url: body.url,
      description: body.description || undefined,
      author: body.author || undefined,
      order: body.order || 0,
    })
    return NextResponse.json({ success: true, resource })
  } catch (error: any) {
    console.error('Error creating resource:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

