import { NextRequest, NextResponse } from 'next/server'
import { getNewsletterProvider } from '@/lib/newsletter'
import { NewsletterSubscriber } from '@/types'
import { db } from '@/lib/db'

const useSupabase = process.env.USE_SUPABASE === 'true'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, source } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const subscriber: NewsletterSubscriber = {
      email,
      name,
      source,
    }

    // Save to Supabase if enabled
    if (useSupabase) {
      try {
        await db.subscribers.create(subscriber)
      } catch (error: any) {
        // If duplicate, that's okay - user already subscribed
        if (!error.message?.includes('duplicate') && !error.code?.includes('23505')) {
          console.error('Error saving to Supabase:', error)
        }
      }
    }

    // Also send to external provider (Resend/Mailchimp)
    const provider = getNewsletterProvider()
    const result = await provider.subscribe(subscriber)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to subscribe' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}


