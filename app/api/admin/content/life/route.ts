import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { LifeMoment } from '@/types'

const lifeFilePath = path.join(process.cwd(), 'content', 'life.json')

export async function GET() {
  try {
    if (!fs.existsSync(lifeFilePath)) {
      return NextResponse.json({ success: true, moments: [] })
    }
    const fileContents = fs.readFileSync(lifeFilePath, 'utf8')
    const moments = JSON.parse(fileContents) as LifeMoment[]
    return NextResponse.json({ success: true, moments })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { moments } = await request.json()

    if (!Array.isArray(moments)) {
      return NextResponse.json({ success: false, message: 'Invalid data format' }, { status: 400 })
    }

    fs.writeFileSync(lifeFilePath, JSON.stringify(moments, null, 2), 'utf8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating life moments:', error)
    return NextResponse.json({ success: false, message: 'Failed to update content' }, { status: 500 })
  }
}


