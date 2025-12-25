import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = await db.planner.finances.getById(params.id)
    
    if (!transaction) {
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, transaction })
  } catch (error: any) {
    console.error('Error fetching finance transaction:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch transaction' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const transaction = await db.planner.finances.update(params.id, {
      date: data.date,
      type: data.type,
      category: data.category,
      amount: data.amount !== undefined ? parseFloat(data.amount) : undefined,
      description: data.description,
      paymentMethod: data.paymentMethod,
      tags: data.tags,
    })

    return NextResponse.json({ success: true, transaction })
  } catch (error: any) {
    console.error('Error updating finance transaction:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to update transaction' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.planner.finances.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting finance transaction:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete transaction' }, { status: 500 })
  }
}


