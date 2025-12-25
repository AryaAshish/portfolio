import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined
    const type = searchParams.get('type') || undefined
    const category = searchParams.get('category') || undefined

    const transactions = await db.planner.finances.getAll({
      startDate,
      endDate,
      type: type as 'income' | 'expense' | 'transfer' | undefined,
      category,
    })
    return NextResponse.json({ success: true, transactions })
  } catch (error: any) {
    console.error('Error fetching finance transactions:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.date || !data.type || !data.category || data.amount === undefined) {
      return NextResponse.json({ success: false, message: 'Date, type, category, and amount are required' }, { status: 400 })
    }

    const transaction = await db.planner.finances.create({
      date: data.date,
      type: data.type,
      category: data.category,
      amount: parseFloat(data.amount),
      description: data.description,
      paymentMethod: data.paymentMethod,
      tags: data.tags || [],
    })

    return NextResponse.json({ success: true, transaction })
  } catch (error: any) {
    console.error('Error creating finance transaction:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create transaction' }, { status: 500 })
  }
}


