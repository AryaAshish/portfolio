import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; resourceId: string } }
) {
  try {
    const body = await request.json()
    const resource = await db.prepResources.update(params.resourceId, body)
    return NextResponse.json({ success: true, resource })
  } catch (error: any) {
    console.error('Error updating resource:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; resourceId: string } }
) {
  try {
    await db.prepResources.delete(params.resourceId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting resource:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

