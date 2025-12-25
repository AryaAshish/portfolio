import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local FIRST
config({ path: resolve(process.cwd(), '.env.local') })

import fs from 'fs'
import path from 'path'
import { getAllPosts } from '../lib/mdx'
import { getHomeContent, getWorkExperience, getSkills, getCourses, getLifeMoments } from '../lib/content'

// Create supabase admin client directly
const { createClient } = require('@supabase/supabase-js')
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function migrateToSupabase() {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  console.log('Starting migration to Supabase...\n')

  try {
    // 1. Migrate Blog Posts
    console.log('Migrating blog posts...')
    const posts = getAllPosts()
    for (const post of posts) {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .upsert({
          slug: post.slug,
          title: post.title,
          description: post.description,
          content: post.content,
          tags: post.tags || [],
          category: post.category || 'general',
          published: post.published,
          published_at: post.publishedAt || new Date().toISOString(),
        }, {
          onConflict: 'slug',
        })

      if (error) {
        console.error(`Error migrating post ${post.slug}:`, error)
      } else {
        console.log(`✓ Migrated: ${post.slug}`)
      }
    }

    // 2. Migrate Content Pages
    console.log('\nMigrating content pages...')

    // Home
    try {
      const homePath = path.join(process.cwd(), 'content', 'home.json')
      if (fs.existsSync(homePath)) {
        const homeContent = JSON.parse(fs.readFileSync(homePath, 'utf8'))
        const { error } = await supabaseAdmin
          .from('content_pages')
          .upsert({
            page_type: 'home',
            content: homeContent,
          }, {
            onConflict: 'page_type',
          })
        if (error) throw error
        console.log('✓ Migrated: home')
      }
    } catch (error) {
      console.error('Error migrating home:', error)
    }

    // About (MDX file)
    try {
      const aboutPath = path.join(process.cwd(), 'content', 'about.md')
      if (fs.existsSync(aboutPath)) {
        const aboutContent = fs.readFileSync(aboutPath, 'utf8')
        const { error } = await supabaseAdmin
          .from('content_pages')
          .upsert({
            page_type: 'about',
            content: { content: aboutContent },
          }, {
            onConflict: 'page_type',
          })
        if (error) throw error
        console.log('✓ Migrated: about')
      }
    } catch (error) {
      console.error('Error migrating about:', error)
    }

    // Experience
    try {
      const experience = getWorkExperience()
      const { error } = await supabaseAdmin
        .from('content_pages')
        .upsert({
          page_type: 'experience',
          content: experience,
        }, {
          onConflict: 'page_type',
        })
      if (error) throw error
      console.log('✓ Migrated: experience')
    } catch (error) {
      console.error('Error migrating experience:', error)
    }

    // Skills
    try {
      const skills = getSkills()
      const { error } = await supabaseAdmin
        .from('content_pages')
        .upsert({
          page_type: 'skills',
          content: skills,
        }, {
          onConflict: 'page_type',
        })
      if (error) throw error
      console.log('✓ Migrated: skills')
    } catch (error) {
      console.error('Error migrating skills:', error)
    }

    // Courses
    try {
      const courses = getCourses()
      const { error } = await supabaseAdmin
        .from('content_pages')
        .upsert({
          page_type: 'courses',
          content: courses,
        }, {
          onConflict: 'page_type',
        })
      if (error) throw error
      console.log('✓ Migrated: courses')
    } catch (error) {
      console.error('Error migrating courses:', error)
    }

    // Life
    try {
      const life = getLifeMoments()
      const { error } = await supabaseAdmin
        .from('content_pages')
        .upsert({
          page_type: 'life',
          content: life,
        }, {
          onConflict: 'page_type',
        })
      if (error) throw error
      console.log('✓ Migrated: life')
    } catch (error) {
      console.error('Error migrating life:', error)
    }

    console.log('\n✅ Migration completed!')
    console.log('\nNext steps:')
    console.log('1. Set USE_SUPABASE=true in .env.local to enable Supabase')
    console.log('2. Test your admin panel to ensure everything works')
    console.log('3. Your file-based content is now backed up in Supabase')

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrateToSupabase()

