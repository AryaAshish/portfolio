import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { AboutTimelineEvent } from '@/lib/content'

const timelineFilePath = path.join(process.cwd(), 'content', 'about-timeline.json')

export async function GET() {
  try {
    if (!fs.existsSync(timelineFilePath)) {
      return NextResponse.json({ success: true, timeline: [] })
    }
    const content = fs.readFileSync(timelineFilePath, 'utf8')
    const timeline = JSON.parse(content) as AboutTimelineEvent[]
    return NextResponse.json({ success: true, timeline })
  } catch (error) {
    console.error('Error fetching timeline:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch timeline' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { timeline } = await request.json()

    if (!Array.isArray(timeline)) {
      return NextResponse.json({ success: false, message: 'Invalid timeline data' }, { status: 400 })
    }

    fs.writeFileSync(timelineFilePath, JSON.stringify(timeline, null, 2), 'utf8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating timeline:', error)
    return NextResponse.json({ success: false, message: 'Failed to update timeline' }, { status: 500 })
  }
}

