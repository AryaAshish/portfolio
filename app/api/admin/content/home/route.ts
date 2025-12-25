import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { HomeContent } from '@/lib/home'
import { db } from '@/lib/db'

const homeFilePath = path.join(process.cwd(), 'content', 'home.json')
const useSupabase = process.env.USE_SUPABASE === 'true'

export async function GET() {
  try {
    if (useSupabase) {
      const content = await db.content.get('home')
      if (content) {
        return NextResponse.json({ success: true, content })
      }
    }

    if (!fs.existsSync(homeFilePath)) {
      return NextResponse.json({ success: true, content: null })
    }
    const fileContents = fs.readFileSync(homeFilePath, 'utf8')
    const content = JSON.parse(fileContents) as HomeContent
    return NextResponse.json({ success: true, content })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ success: false, message: 'Invalid content' }, { status: 400 })
    }

    if (useSupabase) {
      await db.content.set('home', content)
      return NextResponse.json({ success: true })
    }

    fs.writeFileSync(homeFilePath, JSON.stringify(content, null, 2), 'utf8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating home page:', error)
    return NextResponse.json({ success: false, message: 'Failed to update content' }, { status: 500 })
  }
}


