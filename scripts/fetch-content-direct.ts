import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST before any other imports
config({ path: resolve(process.cwd(), '.env.local') })

// Now import Supabase after env vars are loaded
import { createClient } from '@supabase/supabase-js'

async function fetchAllContent() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  console.log('Supabase URL:', supabaseUrl)
  console.log('Service Key exists:', !!supabaseServiceKey)
  console.log('USE_SUPABASE:', process.env.USE_SUPABASE)
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  console.log('\n' + '='.repeat(80))
  console.log('FETCHING ALL SUPABASE CONTENT')
  console.log('='.repeat(80))

  const contentTypes = [
    'home',
    'about-timeline',
    'experience',
    'experience-page',
    'skills',
    'courses',
    'life',
    'hire'
  ]

  for (const type of contentTypes) {
    console.log('\n' + '-'.repeat(80))
    console.log(`PAGE TYPE: ${type}`)
    console.log('-'.repeat(80))
    
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('content')
        .eq('page_type', type)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('❌ No content found in Supabase')
        } else {
          console.error('Error:', error.message)
        }
      } else if (data) {
        console.log('✅ Content found!')
        console.log(JSON.stringify(data.content, null, 2))
      } else {
        console.log('❌ No content found')
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('FETCH COMPLETE')
  console.log('='.repeat(80))
}

fetchAllContent().catch(console.error)
