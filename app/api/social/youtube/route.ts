import { NextRequest, NextResponse } from 'next/server'
import { social } from '@/lib/social'
import { SocialPost, YouTubeVideo } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

async function fetchYouTubeVideos(maxResults: number = 6): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    console.warn('YouTube API credentials not configured')
    return []
  }

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=${maxResults}`
    
    const searchResponse = await fetch(searchUrl)
    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.statusText}`)
    }
    
    const searchData = await searchResponse.json()
    
    if (!searchData.items || searchData.items.length === 0) {
      return []
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails,statistics`
    
    const detailsResponse = await fetch(detailsUrl)
    if (!detailsResponse.ok) {
      throw new Error(`YouTube API error: ${detailsResponse.statusText}`)
    }
    
    const detailsData = await detailsResponse.json()
    
    return detailsData.items.map((item: any) => ({
      id: item.id,
      videoId: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      channelId: item.snippet.channelId,
      viewCount: parseInt(item.statistics?.viewCount || '0'),
      duration: item.contentDetails?.duration,
    }))
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return []
  }
}

function convertToSocialPosts(videos: YouTubeVideo[]): SocialPost[] {
  return videos.map(video => ({
    id: video.id,
    platform: 'youtube' as const,
    externalId: video.id,
    title: video.title,
    content: video.description || video.title,
    permalink: `https://www.youtube.com/watch?v=${video.id}`,
    timestamp: video.publishedAt,
    mediaUrl: video.thumbnailUrl,
  }))
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const refresh = searchParams.get('refresh') === 'true'
    const limit = parseInt(searchParams.get('limit') || '6')

    if (!refresh) {
      const shouldRefresh = await social.shouldRefreshCache('youtube', 60)
      if (!shouldRefresh) {
        const cached = await social.getCachedPosts('youtube', limit)
        if (cached.length > 0) {
          return NextResponse.json({ success: true, posts: cached, cached: true })
        }
      }
    }

    const videos = await fetchYouTubeVideos(limit)
    if (videos.length === 0) {
      const cached = await social.getCachedPosts('youtube', limit)
      return NextResponse.json({ success: true, posts: cached, cached: true, fallback: true })
    }

    const socialPosts = convertToSocialPosts(videos)
    await social.cachePosts(socialPosts)

    return NextResponse.json({ success: true, posts: socialPosts, cached: false })
  } catch (error: any) {
    console.error('Error in YouTube API route:', error)
    const cached = await social.getCachedPosts('youtube', 6)
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch YouTube videos',
      posts: cached,
      cached: true,
      fallback: true,
    })
  }
}


