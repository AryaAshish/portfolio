import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { HirePageContent } from '@/types'
import { db } from '@/lib/db'

const hireFilePath = path.join(process.cwd(), 'content', 'hire.json')
const useSupabase = process.env.USE_SUPABASE === 'true'

export async function GET() {
  try {
    if (useSupabase) {
      const content = await db.content.get('hire')
      if (content) {
        return NextResponse.json({ success: true, content })
      }
    }

    if (!fs.existsSync(hireFilePath)) {
      return NextResponse.json({ success: true, content: null })
    }
    const fileContents = fs.readFileSync(hireFilePath, 'utf8')
    const content = JSON.parse(fileContents) as HirePageContent
    return NextResponse.json({ success: true, content })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (useSupabase) {
      await db.content.set('hire', content)
      return NextResponse.json({ success: true })
    }

    fs.writeFileSync(hireFilePath, JSON.stringify(content, null, 2), 'utf8')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save content' }, { status: 500 })
  }
}


