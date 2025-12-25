import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getPostBySlug } from '@/lib/mdx'
import { db } from '@/lib/db'

const postsDirectory = path.join(process.cwd(), 'content', 'blog')
const useSupabase = process.env.USE_SUPABASE === 'true'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (useSupabase) {
      const post = await db.blog.getBySlug(params.slug)
      if (!post) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, post })
    } else {
      const post = getPostBySlug(params.slug)
      if (!post) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, post })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json()
    const oldSlug = params.slug
    const newSlug = data.slug || oldSlug

    if (!data.title || !data.content) {
      return NextResponse.json({ success: false, message: 'Title and content are required' }, { status: 400 })
    }

    if (useSupabase) {
      const existing = await db.blog.getBySlug(oldSlug)
      if (!existing) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
      }

      if (oldSlug !== newSlug) {
        await db.blog.delete(oldSlug)
        await db.blog.create({
          slug: newSlug,
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
      } else {
        await db.blog.update(oldSlug, {
          title: data.title,
          description: data.description,
          content: data.content,
          tags: data.tags,
          category: data.category,
          published: data.published,
          publishedAt: data.publishedAt || data.date,
          image: data.image,
        })
      }

      return NextResponse.json({ success: true, slug: newSlug })
    } else {
      const oldFilePath = path.join(postsDirectory, `${oldSlug}.mdx`)
      const newFilePath = path.join(postsDirectory, `${newSlug}.mdx`)

      if (!fs.existsSync(oldFilePath)) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
      }

      const mdxContent = generateMDXContent({
        ...data,
        slug: newSlug,
      })

      if (oldSlug !== newSlug) {
        fs.unlinkSync(oldFilePath)
      }

      fs.writeFileSync(newFilePath, mdxContent, 'utf8')

      return NextResponse.json({ success: true, slug: newSlug })
    }
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ success: false, message: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (useSupabase) {
      const existing = await db.blog.getBySlug(params.slug)
      if (!existing) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
      }
      await db.blog.delete(params.slug)
      return NextResponse.json({ success: true })
    } else {
      const filePath = path.join(postsDirectory, `${params.slug}.mdx`)

      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
      }

      fs.unlinkSync(filePath)

      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete post' }, { status: 500 })
  }
}


