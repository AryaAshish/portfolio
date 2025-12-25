import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local FIRST, before any other imports
config({ path: resolve(process.cwd(), '.env.local') })

// Now import supabase after env vars are loaded
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Create clients directly for testing
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
const supabaseAdmin = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
}) : null

async function testConnection() {
  console.log('Testing Supabase connection...\n')

  // Test 1: Check if Supabase URL and keys are set
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const hasValidUrl = url && !url.includes('your_') && url.startsWith('http')
  const hasValidAnonKey = anonKey && !anonKey.includes('your_') && anonKey.length > 10
  const hasValidServiceKey = serviceKey && serviceKey !== 'your_service_role_key_here' && serviceKey.length > 10

  console.log('1. Environment Variables:')
  console.log(`   URL: ${hasValidUrl ? '✅ Valid' : url ? '⚠️  Set but invalid' : '❌ Missing'}`)
  console.log(`   Anon Key: ${hasValidAnonKey ? '✅ Valid' : anonKey ? '⚠️  Set but invalid' : '❌ Missing'}`)
  console.log(`   Service Key: ${hasValidServiceKey ? '✅ Valid' : serviceKey ? '⚠️  Placeholder (needs real key)' : '❌ Missing'}\n`)

  if (!hasValidUrl || !hasValidAnonKey) {
    console.error('❌ Missing or invalid required environment variables!')
    if (!hasValidUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL is missing or invalid')
    if (!hasValidAnonKey) console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid')
    process.exit(1)
  }

  // Test 2: Test public client connection
  console.log('2. Testing Public Client Connection:')
  if (!hasValidUrl || !hasValidAnonKey) {
    console.log('   ⚠️  Cannot test - URL or Anon Key invalid')
  } else if (!supabase) {
    console.log('   ❌ Supabase client not initialized (check your keys)')
  } else {
    try {
      const { data, error } = await supabase.from('blog_posts').select('count').limit(1)
      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log('   ⚠️  Tables not created yet. Run the schema.sql in Supabase SQL Editor first.')
          console.log('   ✅ But connection to Supabase works!')
        } else {
          console.log(`   ❌ Error: ${error.message}`)
        }
      } else {
        console.log('   ✅ Public client connected successfully!')
      }
    } catch (error: any) {
      console.log(`   ❌ Connection failed: ${error.message}`)
    }
  }

  // Test 3: Test admin client (if service key is set)
  if (hasValidServiceKey) {
    console.log('\n3. Testing Admin Client Connection:')
    try {
      const { data, error } = await supabaseAdmin!.from('blog_posts').select('count').limit(1)
      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log('   ⚠️  Tables not created yet. Run the schema.sql in Supabase SQL Editor first.')
        } else {
          console.log(`   ❌ Error: ${error.message}`)
        }
      } else {
        console.log('   ✅ Admin client connected successfully!')
      }
    } catch (error: any) {
      console.log(`   ❌ Connection failed: ${error.message}`)
    }
  } else {
    console.log('\n3. Admin Client:')
    console.log('   ⚠️  Service role key not set. Add SUPABASE_SERVICE_ROLE_KEY to .env.local')
  }

  console.log('\n✅ Connection test complete!')
  console.log('\nNext steps:')
  console.log('1. Get your service_role key from Supabase Dashboard → Settings → API')
  console.log('2. Add it to .env.local as SUPABASE_SERVICE_ROLE_KEY')
  console.log('3. Run the schema.sql in Supabase SQL Editor')
  console.log('4. Run this test again to verify everything works')
}

testConnection().catch(console.error)

