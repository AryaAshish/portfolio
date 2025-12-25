'use client'

import { SocialPost } from '@/types'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { format } from 'date-fns'
import Link from 'next/link'

interface SocialPostCardProps {
  post: SocialPost
  index: number
}

const platformIcons = {
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
}

export function SocialPostCard({ post, index }: SocialPostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="card-hover bg-neutral-white rounded-xl overflow-hidden shadow-lg border border-ocean-light/20 group"
    >
      <Link href={post.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative w-full h-48 bg-ocean-pale/10">
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized={post.thumbnailUrl.includes('supabase.co') || post.thumbnailUrl.includes('googleapis.com') || post.thumbnailUrl.includes('fbcdn.net')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-neutral-white">
              <div className="bg-ocean-deep/80 rounded-full p-1.5">
                {platformIcons[post.platform]}
              </div>
              <span className="text-xs font-medium">
                {post.platform === 'youtube' ? 'Watch on YouTube' : 'View on Instagram'}
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-teal-base">
              {platformIcons[post.platform]}
              <span className="text-xs font-semibold uppercase tracking-wide">
                {post.platform === 'youtube' ? 'YouTube' : 'Instagram'}
              </span>
            </div>
            <span className="text-xs text-ocean-light">
              {format(new Date(post.publishedAt), 'MMM d, yyyy')}
            </span>
          </div>
          <h3 className="font-serif text-lg text-ocean-deep mb-2 line-clamp-2 group-hover:text-teal-base transition-colors">
            {post.title}
          </h3>
          {post.description && (
            <p className="text-sm text-ocean-base line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          )}
          {post.metadata?.viewCount && (
            <p className="text-xs text-ocean-light mt-2">
              {post.metadata.viewCount.toLocaleString()} views
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  )
}


