import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getAllPosts } from '@/lib/mdx'
import { db } from '@/lib/db'

const postsDirectory = path.join(process.cwd(), 'content', 'blog')
const useSupabase = process.env.USE_SUPABASE === 'true'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateMDXContent(data: any): string {
  const frontMatter = `---
title: "${data.title.replace(/"/g, '\\"')}"
description: "${data.description.replace(/"/g, '\\"')}"
date: "${data.date}"
publishedAt: "${data.publishedAt || data.date}"
tags: [${data.tags.map((tag: string) => `"${tag.replace(/"/g, '\\"')}"`).join(', ')}]
category: "${data.category}"
published: ${data.published}
---

${data.content}`
  return frontMatter
}

export async function GET() {
  try {
    if (useSupabase) {
      const posts = await db.blog.getAll()
      return NextResponse.json({ success: true, posts })
    } else {
      const posts = getAllPosts()
      return NextResponse.json({ success: true, posts })
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const slug = data.slug || generateSlug(data.title)

    if (!data.title || !data.content) {
      return NextResponse.json({ success: false, message: 'Title and content are required' }, { status: 400 })
    }

    if (useSupabase) {
      const existing = await db.blog.getBySlug(slug)
      if (existing) {
        return NextResponse.json({ success: false, message: 'Post with this slug already exists' }, { status: 400 })
      }

      await db.blog.create({
        slug,
        title: data.title,
        description: data.description,
        content: data.content,
        tags: data.tags || [],
        category: data.category || 'general',
        published: data.published ?? false,
        date: data.date || data.publishedAt || new Date().toISOString(),
        publishedAt: data.publishedAt || data.date || new Date().toISOString(),
        image: data.image || undefined,
      })

      return NextResponse.json({ success: true, slug })
    } else {
      const filePath = path.join(postsDirectory, `${slug}.mdx`)
      if (fs.existsSync(filePath)) {
        return NextResponse.json({ success: false, message: 'Post with this slug already exists' }, { status: 400 })
      }

      const mdxContent = generateMDXContent({
        ...data,
        slug,
      })

      fs.writeFileSync(filePath, mdxContent, 'utf8')
      return NextResponse.json({ success: true, slug })
    }
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ success: false, message: 'Failed to create post' }, { status: 500 })
  }
}


