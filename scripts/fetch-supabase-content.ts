import { config } from 'dotenv'
import { resolve } from 'path'
import { db } from '../lib/db'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function fetchAllContent() {
  console.log('='.repeat(80))
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
      const content = await db.content.get(type)
      if (content) {
        console.log(JSON.stringify(content, null, 2))
      } else {
        console.log('No content found in Supabase')
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
