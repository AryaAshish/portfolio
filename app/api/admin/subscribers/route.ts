import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const useSupabase = process.env.USE_SUPABASE === 'true'

export async function GET() {
  try {
    if (!useSupabase) {
      return NextResponse.json({ success: false, message: 'Supabase not enabled' }, { status: 400 })
    }

    const subscribers = await db.subscribers.getAll()
    return NextResponse.json({ success: true, subscribers })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch subscribers' }, { status: 500 })
  }
}


