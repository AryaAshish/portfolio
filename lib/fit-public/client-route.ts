import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createFitPublicRouteClient() {
  const url = process.env.NEXT_PUBLIC_FITTRACK_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_FITTRACK_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      'NEXT_PUBLIC_FITTRACK_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_FITTRACK_PUBLIC_SUPABASE_ANON_KEY are required'
    )
  }

  const cookieStore = cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options)
        }
      },
    },
  })
}
