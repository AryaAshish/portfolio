import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { WorkExperience } from '@/types'

const experienceFilePath = path.join(process.cwd(), 'content', 'experience.json')
const experiencePageFilePath = path.join(process.cwd(), 'content', 'experience-page.json')

export async function GET() {
  try {
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


