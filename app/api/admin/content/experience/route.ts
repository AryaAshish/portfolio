import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { WorkExperience } from '@/types'
import { db } from '@/lib/db'

const experienceFilePath = path.join(process.cwd(), 'content', 'experience.json')
const experiencePageFilePath = path.join(process.cwd(), 'content', 'experience-page.json')
const useSupabase = process.env.USE_SUPABASE === 'true'

export async function GET() {
  try {
    if (useSupabase) {
      const [experiences, pageContent] = await Promise.all([
        db.content.get('experience'),
        db.content.get('experience-page'),
      ])
      if (experiences !== null || pageContent !== null) {
        return NextResponse.json({ 
          success: true, 
          experiences: experiences || [], 
          pageContent: pageContent || null 
        })
      }
    }

    const experiences: WorkExperience[] = []
    if (fs.existsSync(experienceFilePath)) {
      const fileContents = fs.readFileSync(experienceFilePath, 'utf8')
      const parsed = JSON.parse(fileContents) as WorkExperience[]
      experiences.push(...parsed)
    }

    let pageContent = null
    if (fs.existsSync(experiencePageFilePath)) {
      const fileContents = fs.readFileSync(experiencePageFilePath, 'utf8')
      pageContent = JSON.parse(fileContents)
    }

    return NextResponse.json({ success: true, experiences, pageContent })
  } catch (error) {
    console.error('Error fetching experience:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { experiences, pageContent } = await request.json()

    if (useSupabase) {
      if (experiences !== undefined) {
        if (!Array.isArray(experiences)) {
          return NextResponse.json({ success: false, message: 'Invalid data format' }, { status: 400 })
        }
        await db.content.set('experience', experiences)
      }

      if (pageContent !== undefined) {
        await db.content.set('experience-page', pageContent)
      }

      return NextResponse.json({ success: true })
    }

    if (experiences !== undefined) {
      if (!Array.isArray(experiences)) {
        return NextResponse.json({ success: false, message: 'Invalid data format' }, { status: 400 })
      }
      fs.writeFileSync(experienceFilePath, JSON.stringify(experiences, null, 2), 'utf8')
    }

    if (pageContent !== undefined) {
      fs.writeFileSync(experiencePageFilePath, JSON.stringify(pageContent, null, 2), 'utf8')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating experience:', error)
    return NextResponse.json({ success: false, message: 'Failed to update content' }, { status: 500 })
  }
}


