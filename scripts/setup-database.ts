import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Load .env.local FIRST
config({ path: resolve(process.cwd(), '.env.local') })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function setupDatabase() {
  console.log('Setting up Supabase database schema...\n')

  try {
    // Read the schema SQL file
    const schemaPath = resolve(process.cwd(), 'supabase', 'schema.sql')
    const schemaSQL = readFileSync(schemaPath, 'utf8')

    console.log('📋 Schema SQL loaded from supabase/schema.sql\n')
    console.log('⚠️  Note: Supabase requires running SQL through their dashboard or API.')
    console.log('   The SQL Editor in Supabase Dashboard is the recommended method.\n')
    
    console.log('📝 To set up the database:')
    console.log('1. Go to https://app.supabase.com')
    console.log('2. Select your project')
    console.log('3. Go to SQL Editor → New Query')
    console.log('4. Copy and paste the contents of supabase/schema.sql')
    console.log('5. Click Run\n')

    // Try to check if tables exist
    console.log('🔍 Checking if tables already exist...\n')
    
    const tables = ['blog_posts', 'content_pages', 'newsletter_subscribers']
    let allExist = true

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count').limit(1)
        if (error && error.message.includes('does not exist')) {
          console.log(`   ❌ ${table} - Not found`)
          allExist = false
        } else {
          console.log(`   ✅ ${table} - Exists`)
        }
      } catch (err: any) {
        if (err.message?.includes('does not exist') || err.message?.includes('relation')) {
          console.log(`   ❌ ${table} - Not found`)
          allExist = false
        } else {
          console.log(`   ⚠️  ${table} - Error checking: ${err.message}`)
        }
      }
    }

    if (allExist) {
      console.log('\n✅ All tables exist! Database is ready.')
      console.log('\nNext steps:')
      console.log('1. Set USE_SUPABASE=true in .env.local')
      console.log('2. Restart your dev server')
      console.log('3. Run: npm run migrate:supabase (to copy existing data)')
    } else {
      console.log('\n❌ Some tables are missing. Please run the schema.sql in Supabase SQL Editor.')
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

setupDatabase()


