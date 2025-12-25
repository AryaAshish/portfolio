import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Check if keys are actual values (not placeholders)
const hasValidUrl = supabaseUrl && !supabaseUrl.includes('your_') && supabaseUrl.startsWith('http')
const hasValidAnonKey = supabaseAnonKey && !supabaseAnonKey.includes('your_') && supabaseAnonKey.length > 10
const hasValidServiceKey = supabaseServiceKey && !supabaseServiceKey.includes('your_') && supabaseServiceKey.length > 10

let supabase: SupabaseClient | null = null
let supabaseAdmin: SupabaseClient | null = null

if (hasValidUrl && hasValidAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Failed to create Supabase client:', error)
  }
} else if (process.env.NODE_ENV !== 'test') {
  console.warn('Supabase environment variables are not set. Using file-based storage as fallback.')
}

if (hasValidUrl && hasValidServiceKey) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  } catch (error) {
    console.warn('Failed to create Supabase admin client:', error)
  }
}

export { supabase, supabaseAdmin }

