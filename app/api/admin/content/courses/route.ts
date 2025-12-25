import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Course } from '@/types'

const coursesFilePath = path.join(process.cwd(), 'content', 'courses.json')

export async function GET() {
  try {
    if (!fs.existsSync(coursesFilePath)) {
      return NextResponse.json({ success: true, courses: [] })
    }
    const fileContents = fs.readFileSync(coursesFilePath, 'utf8')
    const courses = JSON.parse(fileContents) as Course[]
    return NextResponse.json({ success: true, courses })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { courses } = await request.json()

    if (!Array.isArray(courses)) {
      return NextResponse.json({ success: false, message: 'Invalid data format' }, { status: 400 })
    }

    fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2), 'utf8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating courses:', error)
    return NextResponse.json({ success: false, message: 'Failed to update content' }, { status: 500 })
  }
}


