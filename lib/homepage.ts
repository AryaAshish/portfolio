import fs from 'fs'
import path from 'path'
import { BlogPost, LifeMoment } from '@/types'
import { getAllPosts } from './mdx'
import { getLifeMoments } from './content'
import { db } from './db'

const useSupabase = process.env.USE_SUPABASE === 'true'

export async function getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
  if (useSupabase) {
    try {
      const posts = await db.blog.getAll()
      return posts.filter(p => p.published).slice(0, limit)
    } catch (error) {
      console.error('Error fetching posts from Supabase:', error)
      return []
    }
  }
  
  // Fallback to files if Supabase is not enabled
  const posts = getAllPosts()
  return posts.slice(0, limit)
}

export async function getRecentLifeMoments(limit: number = 3): Promise<LifeMoment[]> {
  const moments = await getLifeMoments()
  return moments.slice(0, limit)
}

export function getAboutTeaser(maxLength: number = 200): string {
  const aboutFilePath = path.join(process.cwd(), 'content', 'about.md')
  
  if (!fs.existsSync(aboutFilePath)) {
    return ''
  }
  
  try {
    const aboutContent = fs.readFileSync(aboutFilePath, 'utf8').replace(/^---[\s\S]*?---\n/, '')
    
    if (aboutContent.length <= maxLength) {
      return aboutContent.trim()
    }
    
    const teaser = aboutContent.substring(0, maxLength)
    const lastSpace = teaser.lastIndexOf(' ')
    return lastSpace > 0 ? teaser.substring(0, lastSpace) + '...' : teaser + '...'
  } catch (error) {
    console.error('Error reading about content:', error)
    return ''
  }
}

