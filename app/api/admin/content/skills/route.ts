import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Skill } from '@/types'
import { db } from '@/lib/db'

const skillsFilePath = path.join(process.cwd(), 'content', 'skills.json')
const useSupabase = process.env.USE_SUPABASE === 'true'

export async function GET() {
  try {
    if (useSupabase) {
      const skills = await db.content.get('skills')
      if (skills) {
        return NextResponse.json({ success: true, skills })
      }
    }

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

    if (useSupabase) {
      await db.content.set('skills', skills)
      return NextResponse.json({ success: true })
    }

    fs.writeFileSync(skillsFilePath, JSON.stringify(skills, null, 2), 'utf8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating skills:', error)
    return NextResponse.json({ success: false, message: 'Failed to update content' }, { status: 500 })
  }
}


