import { SocialPost, YouTubeVideo, InstagramPost } from '@/types'
import { supabaseAdmin } from './supabase'

const useSupabase = process.env.USE_SUPABASE === 'true' && supabaseAdmin !== null

export const social = {
  async getCachedPosts(platform: 'youtube' | 'instagram', limit: number = 6): Promise<SocialPost[]> {
    if (!useSupabase) return []
    
    const { data, error } = await supabaseAdmin!
      .from('social_posts')
      .select('*')
      .eq('platform', platform)
      .order('published_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching cached social posts:', error)
      return []
    }
    
    return (data || []).map((post: any) => ({
      id: post.id,
      platform: post.platform,
      externalId: post.external_id,
      title: post.title,
      description: post.description || undefined,
      thumbnailUrl: post.thumbnail_url,
      url: post.url,
      publishedAt: post.published_at,
      metadata: post.metadata || undefined,
      cachedAt: post.cached_at,
    }))
  },

  async cachePosts(posts: SocialPost[]): Promise<void> {
    if (!useSupabase || posts.length === 0) return
    
    const postsToInsert = posts.map(post => ({
      platform: post.platform,
      external_id: post.externalId,
      title: post.title,
      description: post.description || null,
      thumbnail_url: post.thumbnailUrl,
      url: post.url,
      published_at: post.publishedAt,
      metadata: post.metadata || null,
    }))
    
    const { error } = await supabaseAdmin!
      .from('social_posts')
      .upsert(postsToInsert, {
        onConflict: 'platform,external_id',
        ignoreDuplicates: false,
      })
    
    if (error) {
      console.error('Error caching social posts:', error)
    }
  },

  async shouldRefreshCache(platform: 'youtube' | 'instagram', maxAgeMinutes: number = 60): Promise<boolean> {
    if (!useSupabase) return true
    
    const { data, error } = await supabaseAdmin!
      .from('social_posts')
      .select('cached_at')
      .eq('platform', platform)
      .order('cached_at', { ascending: false })
      .limit(1)
    
    if (error || !data || data.length === 0) return true
    
    const lastCached = new Date(data[0].cached_at)
    const now = new Date()
    const ageMinutes = (now.getTime() - lastCached.getTime()) / (1000 * 60)
    
    return ageMinutes > maxAgeMinutes
  },
}


