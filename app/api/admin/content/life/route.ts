import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { LifeMoment } from '@/types'
import { db } from '@/lib/db'

const lifeFilePath = path.join(process.cwd(), 'content', 'life.json')
const useSupabase = process.env.USE_SUPABASE === 'true'

export async function GET() {
  try {
    console.log('[API /api/admin/content/life] useSupabase:', useSupabase)
    if (useSupabase) {
      const moments = await db.content.get('life')
      console.log('[API /api/admin/content/life] Supabase returned:', moments ? `${moments.length} moments` : 'null')
      if (moments) {
        return NextResponse.json({ success: true, moments })
      }
    }

    console.log('[API /api/admin/content/life] Falling back to file, path:', lifeFilePath)
    if (!fs.existsSync(lifeFilePath)) {
      console.log('[API /api/admin/content/life] File does not exist, returning empty array')
      return NextResponse.json({ success: true, moments: [] })
    }
    const fileContents = fs.readFileSync(lifeFilePath, 'utf8')
    const moments = JSON.parse(fileContents) as LifeMoment[]
    console.log('[API /api/admin/content/life] Returning from file:', moments.length, 'moments')
    return NextResponse.json({ success: true, moments })
  } catch (error) {
    console.error('[API /api/admin/content/life] Error:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { moments } = await request.json()

    if (!Array.isArray(moments)) {
      return NextResponse.json({ success: false, message: 'Invalid data format' }, { status: 400 })
    }

    if (useSupabase) {
      await db.content.set('life', moments)
      return NextResponse.json({ success: true })
    }

    fs.writeFileSync(lifeFilePath, JSON.stringify(moments, null, 2), 'utf8')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating life moments:', error)
    return NextResponse.json({ success: false, message: 'Failed to update content' }, { status: 500 })
  }
}


