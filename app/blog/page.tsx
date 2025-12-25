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
  
  // Extract unique tags and categories from posts
  const tagSet = new Set<string>()
  const categorySet = new Set<string>()
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag))
    categorySet.add(post.category)
  })
  const allTags = Array.from(tagSet).sort()
  const categories = Array.from(categorySet).sort()

  // Group tags by category with main tags
  const tagGroups: Array<{ mainTag: string; mainTagSlug: string; childTags: string[] }> = []

  // Define tag mappings
  const androidTags = ['activity', 'fragment', 'intent', 'lifecycle', 'android-fundamentals']
  const architectureTags = ['mvvm', 'clean-architecture', 'repository', 'architecture', 'design-patterns', 'dependency-injection', 'hilt', 'dagger']
  const uiTags = ['recyclerview', 'listview', 'viewholder', 'constraintlayout', 'material-design', 'ui', 'layout', 'views']
  const performanceTags = ['memory', 'leaks', 'optimization', 'performance', 'proguard', 'r8', 'profiling']
  const networkingTags = ['retrofit', 'networking', 'api', 'http', 'error-handling', 'retry']
  const kotlinTags = ['coroutines', 'flow', 'livedata', 'suspend', 'rxjava', 'reactive', 'async', 'concurrency']
  const interviewTags = ['interview-prep']

  // Group tags
  const groupedTags: Record<string, string[]> = {
    'android': [],
    'architecture': [],
    'ui': [],
    'performance': [],
    'networking': [],
    'kotlin': [],
    'interview-prep': [],
    'other': [],
  }

  allTags.forEach(tag => {
    const lowerTag = tag.toLowerCase()
    if (androidTags.some(t => lowerTag.includes(t)) || lowerTag === 'android') {
      if (lowerTag !== 'android') groupedTags['android'].push(tag)
    } else if (architectureTags.some(t => lowerTag.includes(t)) || lowerTag === 'architecture') {
      if (lowerTag !== 'architecture') groupedTags['architecture'].push(tag)
    } else if (uiTags.some(t => lowerTag.includes(t)) || lowerTag === 'ui') {
      if (lowerTag !== 'ui') groupedTags['ui'].push(tag)
    } else if (performanceTags.some(t => lowerTag.includes(t)) || lowerTag === 'performance') {
      if (lowerTag !== 'performance') groupedTags['performance'].push(tag)
    } else if (networkingTags.some(t => lowerTag.includes(t)) || lowerTag === 'networking') {
      if (lowerTag !== 'networking') groupedTags['networking'].push(tag)
    } else if (kotlinTags.some(t => lowerTag.includes(t)) || lowerTag === 'kotlin') {
      if (lowerTag !== 'kotlin') groupedTags['kotlin'].push(tag)
    } else if (interviewTags.some(t => lowerTag.includes(t)) || lowerTag === 'interview-prep') {
      if (lowerTag !== 'interview-prep') groupedTags['interview-prep'].push(tag)
    } else {
      groupedTags['other'].push(tag)
    }
  })

  // Create tag groups with main tags
  if (groupedTags['android'].length > 0 || allTags.some(t => t.toLowerCase() === 'android')) {
    tagGroups.push({
      mainTag: 'Android',
      mainTagSlug: 'android',
      childTags: groupedTags['android']
    })
  }
  if (groupedTags['kotlin'].length > 0 || allTags.some(t => t.toLowerCase() === 'kotlin')) {
    tagGroups.push({
      mainTag: 'Kotlin',
      mainTagSlug: 'kotlin',
      childTags: groupedTags['kotlin']
    })
  }
  if (groupedTags['architecture'].length > 0 || allTags.some(t => t.toLowerCase() === 'architecture')) {
    tagGroups.push({
      mainTag: 'Architecture',
      mainTagSlug: 'architecture',
      childTags: groupedTags['architecture']
    })
  }
  if (groupedTags['ui'].length > 0 || allTags.some(t => t.toLowerCase() === 'ui')) {
    tagGroups.push({
      mainTag: 'UI/UX',
      mainTagSlug: 'ui',
      childTags: groupedTags['ui']
    })
  }
  if (groupedTags['performance'].length > 0 || allTags.some(t => t.toLowerCase() === 'performance')) {
    tagGroups.push({
      mainTag: 'Performance',
      mainTagSlug: 'performance',
      childTags: groupedTags['performance']
    })
  }
  if (groupedTags['networking'].length > 0 || allTags.some(t => t.toLowerCase() === 'networking')) {
    tagGroups.push({
      mainTag: 'Networking',
      mainTagSlug: 'networking',
      childTags: groupedTags['networking']
    })
  }
  if (groupedTags['interview-prep'].length > 0 || allTags.some(t => t.toLowerCase() === 'interview-prep')) {
    tagGroups.push({
      mainTag: 'Interview Prep',
      mainTagSlug: 'interview-prep',
      childTags: groupedTags['interview-prep']
    })
  }

  // Add standalone tags (tags that don't belong to any group)
  const standaloneTags = groupedTags['other'].filter(tag => {
    const lowerTag = tag.toLowerCase()
    return !['android', 'kotlin', 'architecture', 'ui', 'performance', 'networking', 'interview-prep'].includes(lowerTag)
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
          {(tagGroups.length > 0 || standaloneTags.length > 0) && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-ocean-deep mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tagGroups.map((group) => (
                  <TagGroup
                    key={group.mainTag}
                    mainTag={group.mainTag}
                    mainTagSlug={group.mainTagSlug}
                    childTags={group.childTags}
                  />
                ))}
                {standaloneTags.map((tag) => (
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

