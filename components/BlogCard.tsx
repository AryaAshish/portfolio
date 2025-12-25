'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/types'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

interface BlogCardProps {
  post: BlogPost
  index: number
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="card-hover bg-neutral-white rounded-xl p-6 md:p-8 shadow-lg border border-ocean-light/20"
    >
      <Link href={`/blog/${post.slug}`}>
        {post.image && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-ocean-pale/10">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized={post.image.includes('supabase.co')}
            />
          </div>
        )}
        <div className="mb-3">
          <span className="text-xs font-semibold text-teal-base uppercase tracking-wide">
            {post.category}
          </span>
          <span className="text-xs text-ocean-light mx-2">•</span>
          <span className="text-xs text-ocean-light">
            {format(new Date(post.publishedAt), 'MMM d, yyyy')}
          </span>
          <span className="text-xs text-ocean-light mx-2">•</span>
          <span className="text-xs text-ocean-light">{post.readingTime} min read</span>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-ocean-deep mb-3 hover:text-teal-base transition-colors heading-serif">
          {post.title}
        </h2>
        <p className="text-ocean-base mb-4 line-clamp-2 leading-relaxed">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-ocean-pale/20 text-ocean-base rounded-full text-xs font-medium hover:bg-ocean-pale/30 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.article>
  )
}

