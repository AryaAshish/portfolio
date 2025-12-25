import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Skill } from '@/types'

const skillsFilePath = path.join(process.cwd(), 'content', 'skills.json')

export async function GET() {
  try {
    if (!fs.existsSync(skillsFilePath)) {
      return NextResponse.json({ success: true, skills: [] })
    }
    const fileContents = fs.readFileSync(skillsFilePath, 'utf8')
    const skills = JSON.parse(fileContents) as Skill[]
    return NextResponse.json({ success: true, skills })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { skills } = await request.json()

    if (!Array.isArray(skills)) {
      return NextResponse.json({ success: false, message: 'Invalid data format' }, { status: 400 })
    }

    fs.writeFileSync(skillsFilePath, JSON.stringify(skills, null, 2), 'utf8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating skills:', error)
    return NextResponse.json({ success: false, message: 'Failed to update content' }, { status: 500 })
  }
}


