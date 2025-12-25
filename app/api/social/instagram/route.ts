import { NextRequest, NextResponse } from 'next/server'
import { social } from '@/lib/social'
import { SocialPost, InstagramPost } from '@/types'

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID

async function fetchInstagramPosts(maxResults: number = 6): Promise<InstagramPost[]> {
  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
    console.warn('Instagram API credentials not configured')
    return []
  }

  try {
    const url = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=${maxResults}`
    
    const response = await fetch(url)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Instagram API error: ${response.statusText} - ${JSON.stringify(errorData)}`)
    }
    
    const data = await response.json()
    
    if (!data.data || data.data.length === 0) {
      return []
    }

    return data.data.map((item: any) => ({
      id: item.id,
      caption: item.caption || undefined,
      mediaType: item.media_type,
      mediaUrl: item.media_url,
      thumbnailUrl: item.thumbnail_url || item.media_url,
      permalink: item.permalink,
      timestamp: item.timestamp,
      likeCount: item.like_count,
      commentsCount: item.comments_count,
    }))
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return []
  }
}

function convertToSocialPosts(posts: InstagramPost[]): SocialPost[] {
  return posts.map(post => ({
    id: post.id,
    platform: 'instagram' as const,
    externalId: post.id,
    title: post.caption ? post.caption.substring(0, 100) : 'Instagram Post',
    description: post.caption || undefined,
    thumbnailUrl: post.thumbnailUrl || '',
    url: post.permalink,
    publishedAt: post.timestamp,
    metadata: {
      mediaType: post.mediaType,
      likeCount: post.likeCount,
      commentsCount: post.commentsCount,
    },
    cachedAt: new Date().toISOString(),
  }))
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const refresh = searchParams.get('refresh') === 'true'
    const limit = parseInt(searchParams.get('limit') || '6')

    if (!refresh) {
      const shouldRefresh = await social.shouldRefreshCache('instagram', 60)
      if (!shouldRefresh) {
        const cached = await social.getCachedPosts('instagram', limit)
        if (cached.length > 0) {
          return NextResponse.json({ success: true, posts: cached, cached: true })
        }
      }
    }

    const posts = await fetchInstagramPosts(limit)
    if (posts.length === 0) {
      const cached = await social.getCachedPosts('instagram', limit)
      return NextResponse.json({ success: true, posts: cached, cached: true, fallback: true })
    }

    const socialPosts = convertToSocialPosts(posts)
    await social.cachePosts(socialPosts)

    return NextResponse.json({ success: true, posts: socialPosts, cached: false })
  } catch (error: any) {
    console.error('Error in Instagram API route:', error)
    const cached = await social.getCachedPosts('instagram', 6)
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch Instagram posts',
      posts: cached,
      cached: true,
      fallback: true,
    })
  }
}


