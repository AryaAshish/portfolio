import { config } from 'dotenv'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const postsDirectory = path.join(process.cwd(), 'content', 'blog')

async function migrateBlogPosts() {
  if (!fs.existsSync(postsDirectory)) {
    console.error('❌ Blog directory not found')
    return
  }

  const files = fs.readdirSync(postsDirectory)
    .filter(file => file.endsWith('.mdx') && !file.includes('example') && !file.startsWith('.'))

  console.log(`\n🚀 Starting migration of ${files.length} blog posts to Supabase...\n`)

  const migrated: string[] = []
  const errors: Array<{ file: string; error: string }> = []

  for (const file of files) {
    try {
      const filePath = path.join(postsDirectory, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      const slug = file.replace(/\.(mdx|md)$/, '')
      
      // Check if post already exists
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('slug', slug)
        .single()

      if (existing) {
        console.log(`⚠️  Post ${slug} already exists, updating...`)
        
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: data.title || '',
            description: data.description || '',
            content: content,
            tags: data.tags || [],
            category: data.category || 'general',
            published: data.published !== false,
            published_at: data.publishedAt || data.date || new Date().toISOString(),
            image: data.image || null,
            video_url: data.videoUrl || null,
          })
          .eq('slug', slug)

        if (error) throw error
        console.log(`✓ Updated: ${slug}`)
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            slug: slug,
            title: data.title || '',
            description: data.description || '',
            content: content,
            tags: data.tags || [],
            category: data.category || 'general',
            published: data.published !== false,
            published_at: data.publishedAt || data.date || new Date().toISOString(),
            image: data.image || null,
            video_url: data.videoUrl || null,
          })

        if (error) throw error
        console.log(`✓ Migrated: ${slug}`)
      }

      migrated.push(slug)
    } catch (error: any) {
      console.error(`❌ Error migrating ${file}:`, error.message)
      errors.push({ file, error: error.message })
    }
  }

  console.log(`\n\n✅ Migration complete!`)
  console.log(`📊 Migrated: ${migrated.length}/${files.length}`)
  console.log(`❌ Errors: ${errors.length}`)

  if (errors.length > 0) {
    console.log(`\n⚠️  Errors:`)
    errors.forEach(({ file, error }) => {
      console.log(`   - ${file}: ${error}`)
    })
  }

  return { migrated, errors }
}

migrateBlogPosts()
  .then(({ migrated, errors }) => {
    if (errors.length === 0 && migrated.length > 0) {
      console.log(`\n💡 Next step: Delete local MDX files after verifying in Supabase`)
      console.log(`   Files to delete: ${migrated.map(s => `content/blog/${s}.mdx`).join(', ')}`)
    }
  })
  .catch(console.error)

