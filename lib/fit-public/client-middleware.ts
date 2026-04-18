import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export function createFitPublicMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  const url = process.env.NEXT_PUBLIC_FITTRACK_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_FITTRACK_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return null
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        }
      },
    },
  })
}
