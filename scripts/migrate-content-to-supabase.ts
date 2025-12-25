import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env.local')
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const contentDir = path.join(process.cwd(), 'content')

interface ContentFile {
  pageType: string
  filePath: string
  description: string
}

const contentFiles: ContentFile[] = [
  { pageType: 'home', filePath: 'home.json', description: 'Home page content' },
  { pageType: 'about-timeline', filePath: 'about-timeline.json', description: 'About page timeline' },
  { pageType: 'courses', filePath: 'courses.json', description: 'Courses list' },
  { pageType: 'skills', filePath: 'skills.json', description: 'Skills list' },
  { pageType: 'life', filePath: 'life.json', description: 'Life moments' },
  { pageType: 'experience', filePath: 'experience.json', description: 'Work experience' },
  { pageType: 'experience-page', filePath: 'experience-page.json', description: 'Experience page content' },
  { pageType: 'hire', filePath: 'hire.json', description: 'Hire page content' },
]

async function migrateContent() {
  console.log('\n🚀 Starting migration of content files to Supabase...\n')

  const migrated: string[] = []
  const errors: Array<{ pageType: string; error: string }> = []
  const skipped: string[] = []

  for (const { pageType, filePath, description } of contentFiles) {
    try {
      const fullPath = path.join(contentDir, filePath)

      if (!fs.existsSync(fullPath)) {
        console.log(`⏭️  Skipping ${pageType}: File not found (${filePath})`)
        skipped.push(pageType)
        continue
      }

      const fileContents = fs.readFileSync(fullPath, 'utf8')
      let content: any

      try {
        content = JSON.parse(fileContents)
      } catch (parseError) {
        throw new Error(`Invalid JSON: ${parseError}`)
      }

      // Check if content already exists
      const { data: existing } = await supabase
        .from('content_pages')
        .select('page_type')
        .eq('page_type', pageType)
        .single()

      if (existing) {
        console.log(`⚠️  ${pageType} already exists, updating...`)
      }

      const { error } = await supabase
        .from('content_pages')
        .upsert({
          page_type: pageType,
          content: content,
        }, {
          onConflict: 'page_type',
        })

      if (error) throw error

      console.log(`✓ ${description}: ${pageType}`)
      migrated.push(pageType)
    } catch (error: any) {
      console.error(`❌ Error migrating ${pageType}:`, error.message)
      errors.push({ pageType, error: error.message })
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary')
  console.log('='.repeat(50))
  console.log(`✅ Migrated: ${migrated.length}`)
  console.log(`⏭️  Skipped: ${skipped.length}`)
  console.log(`❌ Errors: ${errors.length}`)

  if (migrated.length > 0) {
    console.log(`\n✅ Successfully migrated:`)
    migrated.forEach(pageType => console.log(`   - ${pageType}`))
  }

  if (skipped.length > 0) {
    console.log(`\n⏭️  Skipped (files not found):`)
    skipped.forEach(pageType => console.log(`   - ${pageType}`))
  }

  if (errors.length > 0) {
    console.log(`\n❌ Errors:`)
    errors.forEach(({ pageType, error }) => {
      console.log(`   - ${pageType}: ${error}`)
    })
  }

  if (errors.length === 0 && migrated.length > 0) {
    console.log(`\n💡 Next steps:`)
    console.log(`   1. Verify the data in Supabase Dashboard → Table Editor → content_pages`)
    console.log(`   2. Set USE_SUPABASE=true in your environment variables`)
    console.log(`   3. Test the admin panel to ensure content loads from Supabase`)
  }

  console.log('')
}

migrateContent()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

