import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { BlogPost } from '@/types'

const postsDirectory = path.join(process.cwd(), 'content', 'blog')

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => file.replace(/\.(mdx|md)$/, ''))
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const readingTimeResult = readingTime(content)

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    publishedAt: data.publishedAt || data.date || new Date().toISOString(),
    readingTime: Math.ceil(readingTimeResult.minutes),
    tags: data.tags || [],
    category: data.category || 'general',
    published: data.published !== false,
    content,
    image: data.image || undefined,
    videoUrl: data.videoUrl || undefined,
  }
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null && post.published)
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

  return posts
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => post.tags.includes(tag))
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category)
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categorySet = new Set<string>()
  posts.forEach((post) => {
    categorySet.add(post.category)
  })
  return Array.from(categorySet).sort()
}

