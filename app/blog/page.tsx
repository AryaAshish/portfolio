import { db } from '@/lib/db'
import { BlogCard } from '@/components/BlogCard'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { AnimatedHeader } from '@/components/AnimatedHeader'
import { TagGroup } from '@/components/TagGroup'
import Link from 'next/link'

export const metadata = {
  title: 'Writing',
  description: 'Tech explainers, career insights, system design, and life reflections',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BlogPage() {
  const allPosts = await db.blog.getAll()
  const posts = allPosts.filter(p => p.published)
  
  // Debug logging
  console.log('[Blog Page] Total posts from Supabase:', allPosts.length)
  console.log('[Blog Page] Published posts:', posts.length)
  
  // Extract unique tags from posts
  const tagSet = new Set<string>()
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag))
  })
  const allTags = Array.from(tagSet).sort()

  // Define 4-6 main tag categories with their child tags
  const mainTagCategories = [
    {
      mainTag: 'Android Development',
      mainTagSlug: 'android',
      childTags: ['activity', 'fragment', 'intent', 'lifecycle', 'android-fundamentals', 'recyclerview', 'listview', 'viewholder', 'constraintlayout', 'material-design', 'ui', 'layout', 'views', 'android']
    },
    {
      mainTag: 'Architecture & Design',
      mainTagSlug: 'architecture',
      childTags: ['mvvm', 'clean-architecture', 'repository', 'architecture', 'design-patterns', 'dependency-injection', 'hilt', 'dagger']
    },
    {
      mainTag: 'Kotlin & Coroutines',
      mainTagSlug: 'kotlin',
      childTags: ['kotlin', 'coroutines', 'flow', 'livedata', 'suspend', 'rxjava', 'reactive', 'async', 'concurrency']
    },
    {
      mainTag: 'Performance & Optimization',
      mainTagSlug: 'performance',
      childTags: ['memory', 'leaks', 'optimization', 'performance', 'proguard', 'r8', 'profiling']
    },
    {
      mainTag: 'Networking & APIs',
      mainTagSlug: 'networking',
      childTags: ['retrofit', 'networking', 'api', 'http', 'error-handling', 'retry']
    },
    {
      mainTag: 'Interview Prep',
      mainTagSlug: 'interview-prep',
      childTags: ['interview-prep']
    }
  ]

  // Check which main tags have matching posts
  const activeMainTags = mainTagCategories.filter(category => {
    return allTags.some(tag => {
      const lowerTag = tag.toLowerCase()
      return category.childTags.some(childTag => lowerTag.includes(childTag.toLowerCase()) || lowerTag === childTag.toLowerCase())
    })
  })

  // Get child tags for each active main tag
  const tagGroups = activeMainTags.map(category => {
    const childTags = allTags.filter(tag => {
      const lowerTag = tag.toLowerCase()
      return category.childTags.some(childTag => 
        lowerTag.includes(childTag.toLowerCase()) || lowerTag === childTag.toLowerCase()
      ) && lowerTag !== category.mainTagSlug.toLowerCase()
    })
    return {
      mainTag: category.mainTag,
      mainTagSlug: category.mainTagSlug,
      childTags: childTags
    }
  })

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
          {tagGroups.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-ocean-deep mb-4">Browse by Topic</h2>
              <div className="flex flex-wrap gap-3">
                {tagGroups.map((group) => (
                  <TagGroup
                    key={group.mainTag}
                    mainTag={group.mainTag}
                    mainTagSlug={group.mainTagSlug}
                    childTags={group.childTags}
                  />
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

