import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { WorkExperience } from '@/types'

const experienceFilePath = path.join(process.cwd(), 'content', 'experience.json')

export async function GET() {
  try {
    if (!fs.existsSync(experienceFilePath)) {
      return NextResponse.json({ success: true, experiences: [] })
    }
    const fileContents = fs.readFileSync(experienceFilePath, 'utf8')
    const experiences = JSON.parse(fileContents) as WorkExperience[]
    return NextResponse.json({ success: true, experiences })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { experiences } = await request.json()

    if (!Array.isArray(experiences)) {
      return NextResponse.json({ success: false, message: 'Invalid data format' }, { status: 400 })
    }

    fs.writeFileSync(experienceFilePath, JSON.stringify(experiences, null, 2), 'utf8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating experience:', error)
    return NextResponse.json({ success: false, message: 'Failed to update content' }, { status: 500 })
  }
}


