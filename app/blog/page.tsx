import { getAllPosts, getAllTags, getAllCategories } from '@/lib/mdx'
import { BlogCard } from '@/components/BlogCard'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { AnimatedHeader } from '@/components/AnimatedHeader'
import Link from 'next/link'

export const metadata = {
  title: 'Writing',
  description: 'Tech explainers, career insights, system design, and life reflections',
}

export default async function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()
  const categories = getAllCategories()

  return (
    <div className="min-h-screen bg-neutral-off">
      <section className="py-20 bg-gradient-to-b from-ocean-deep to-ocean-dark text-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedHeader
            title="Writing"
            subtitle="Tech explainers, interview prep, system design, career lessons, and life reflections"
          />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-ocean-dark to-neutral-off">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tags.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-ocean-deep mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag}`}
                    className="px-4 py-2 bg-neutral-white text-ocean-deep rounded-lg text-sm font-medium hover:bg-teal-base hover:text-neutral-white transition-colors shadow-md border border-ocean-light/20"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <BlogCard key={post.slug} post={post} index={idx} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-white rounded-xl p-12 text-center shadow-lg">
              <p className="text-ocean-base text-lg">
                No blog posts yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-ocean-dark to-ocean-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup source="blog" />
        </div>
      </section>
    </div>
  )
}

