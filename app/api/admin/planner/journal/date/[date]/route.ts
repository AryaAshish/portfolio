import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const entry = await db.planner.journal.getByDate(params.date)
    return NextResponse.json({ success: true, entry })
  } catch (error: any) {
    console.error('Error fetching journal entry by date:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch entry' }, { status: 500 })
  }
}


