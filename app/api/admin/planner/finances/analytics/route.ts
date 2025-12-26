import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json({ success: false, message: 'Start date and end date are required' }, { status: 400 })
    }

    const analytics = await db.planner.finances.getAnalytics(startDate, endDate)
    return NextResponse.json({ success: true, analytics })
  } catch (error: any) {
    console.error('Error fetching finance analytics:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch analytics' }, { status: 500 })
  }
}


