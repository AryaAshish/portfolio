import 'server-only'
import { createClient } from '@supabase/supabase-js'

let adminClient: ReturnType<typeof createClient> | null = null

export function getFitPublicAdmin() {
  if (!adminClient) {
    const url = process.env.NEXT_PUBLIC_FITTRACK_PUBLIC_SUPABASE_URL
    const key = process.env.FITTRACK_PUBLIC_SUPABASE_SERVICE_KEY
    if (!url || !key) {
      throw new Error(
        'NEXT_PUBLIC_FITTRACK_PUBLIC_SUPABASE_URL and FITTRACK_PUBLIC_SUPABASE_SERVICE_KEY are required'
      )
    }
    adminClient = createClient(url, key, { auth: { persistSession: false } })
  }
  return adminClient
}
