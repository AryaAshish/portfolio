import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await db.blog.getAll()
  const publishedPosts = posts.filter(p => p.published)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Portfolio Blog</title>
    <description>Tech explainers, career insights, system design, and life reflections</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${publishedPosts
      .map(
        (post) => `    <item>
      <title>${post.title}</title>
      <description>${post.description}</description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}



