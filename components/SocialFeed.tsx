'use client'

import { useEffect, useState } from 'react'
import { SocialPost } from '@/types'
import { SocialPostCard } from './SocialPostCard'
import { AnimatedSection } from './AnimatedSection'
import Link from 'next/link'

interface SocialFeedProps {
  platform: 'youtube' | 'instagram'
  limit?: number
  title?: string
  showViewAll?: boolean
  viewAllHref?: string
}

export function SocialFeed({ platform, limit = 6, title, showViewAll = true, viewAllHref }: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await fetch(`/api/social/${platform}?limit=${limit}`)
        const data = await response.json()
        
        if (data.success && data.posts) {
          setPosts(data.posts)
        } else {
          setError(data.message || 'Failed to fetch posts')
        }
      } catch (err: any) {
        console.error(`Error fetching ${platform} posts:`, err)
        setError(err.message || 'Failed to fetch posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [platform, limit])

  const defaultTitle = platform === 'youtube' ? 'Latest Videos' : 'Latest Posts'
  const defaultHref = platform === 'youtube' 
    ? 'https://www.youtube.com/@yourchannel' 
    : 'https://www.instagram.com/musafir.codes/'

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-ocean-deep mb-4">
              {title || defaultTitle}
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-neutral-white rounded-xl overflow-hidden shadow-lg border border-ocean-light/20 animate-pulse">
                <div className="w-full h-48 bg-ocean-pale/20" />
                <div className="p-4">
                  <div className="h-4 bg-ocean-pale/20 rounded mb-2" />
                  <div className="h-4 bg-ocean-pale/20 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error && posts.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-ocean-deep mb-4">
              {title || defaultTitle}
            </h2>
            <p className="text-ocean-base">
              Unable to load {platform} content at the moment.
            </p>
          </AnimatedSection>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-neutral-off">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-ocean-deep mb-4">
            {title || defaultTitle}
          </h2>
          {showViewAll && (
            <Link
              href={viewAllHref || defaultHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-base hover:text-teal-dark font-medium inline-flex items-center gap-2"
            >
              View all on {platform === 'youtube' ? 'YouTube' : 'Instagram'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          )}
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <SocialPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}


