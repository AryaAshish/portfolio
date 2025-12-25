import { NextRequest, NextResponse } from 'next/server'
import { ContactFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, purpose } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    const formData: ContactFormData = {
      name,
      email,
      message,
      purpose: purpose || 'general',
    }

    console.log('Contact form submission:', formData)

    return NextResponse.json({
      success: true,
      message: "Message received. I'll get back to you soon!",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

