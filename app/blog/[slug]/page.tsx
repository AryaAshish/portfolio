import { db } from '@/lib/db'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { MarkdownContent } from '@/components/MarkdownContent'
import { YouTubeEmbed } from '@/components/YouTubeEmbed'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await db.blog.getAll()
  return posts.filter(p => p.published).map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await db.blog.getBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      tags: post.tags,
      ...(post.image && {
        images: [
          {
            url: post.image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      }),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await db.blog.getBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-off">
      <article className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-pale/10 hover:bg-ocean-pale/20 text-ocean-deep rounded-lg font-medium transition-all mb-8 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Writing
          </Link>

          <header className="mb-12">
            {post.image && (
              <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden bg-ocean-pale/10">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={post.image.includes('supabase.co')}
                />
              </div>
            )}
            <div className="mb-4">
              <span className="text-sm font-semibold text-teal-base uppercase tracking-wide">
                {post.category}
              </span>
              <span className="text-sm text-ocean-light mx-2">•</span>
              <span className="text-sm text-ocean-light">
                {format(new Date(post.publishedAt), 'MMM d, yyyy')}
              </span>
              <span className="text-sm text-ocean-light mx-2">•</span>
              <span className="text-sm text-ocean-light">{post.readingTime} min read</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-ocean-deep mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-ocean-base mb-6">{post.description}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-ocean-pale/20 text-ocean-base rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            {post.videoUrl && (
              <div className="mt-8">
                <YouTubeEmbed videoId={post.videoUrl} title={post.title} />
              </div>
            )}
          </header>

          <div className="bg-neutral-white rounded-xl p-8 md:p-12 shadow-lg">
            <MarkdownContent content={post.content} />
          </div>
        </div>
      </article>

      <section className="py-20 bg-gradient-to-br from-ocean-dark to-ocean-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup source={`blog-${post.slug}`} />
        </div>
      </section>
    </div>
  )
}

