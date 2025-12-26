import { Hero } from '@/components/Hero'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { AnimatedSection } from '@/components/AnimatedSection'
import { BlogCard } from '@/components/BlogCard'
import { LifeMomentCard } from '@/components/LifeMomentCard'
import { getHomeContent } from '@/lib/home'
import { getRecentPosts, getRecentLifeMoments, getAboutTeaser } from '@/lib/homepage'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const [content, recentPosts, recentMoments] = await Promise.all([
    getHomeContent(),
    getRecentPosts(3),
    getRecentLifeMoments(3),
  ])
  
  // Debug logging
  console.log('[Home Page] Recent posts:', recentPosts.length)
  const aboutTeaser = getAboutTeaser(200)

  return (
    <div>
      <Hero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        backgroundImageUrl={content.hero.backgroundImageUrl}
        coralImages={content.hero.coralImages}
        cta={content.hero.cta}
      />

      <section className="py-16 bg-neutral-off">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-ocean-deep mb-4">
              {content.whatImGoodAt.title}
            </h2>
            <p className="text-xl text-ocean-base max-w-3xl mx-auto">
              {content.whatImGoodAt.description}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {content.whatImGoodAt.items.slice(0, 3).map((item, index) => (
              <AnimatedSection key={index} delay={0.1 * (index + 1)} className="h-full">
                <div className="card-hover bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/10 h-full flex flex-col">
                  <h3 className="font-serif text-2xl text-ocean-deep mb-3 heading-serif">{item.title}</h3>
                  <p className="text-ocean-base leading-relaxed flex-grow text-sm">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          {content.whatImGoodAt.items.length > 3 && (
            <div className="mt-8 text-center">
              <Link
                href="/about"
                className="text-teal-base hover:text-teal-dark font-medium"
              >
                Learn more about my approach →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-ocean-deep text-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">
              {content.whatIDontOptimizeFor.title}
            </h2>
            <p className="text-lg text-ocean-pale max-w-2xl mx-auto">
              {content.whatIDontOptimizeFor.description}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {content.whatIDontOptimizeFor.items.slice(0, 2).map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1} className="h-full">
                <div className="card-hover bg-ocean-dark/50 rounded-xl p-5 border border-ocean-base/30 hover:border-ocean-base/50 h-full flex flex-col">
                  <h3 className="font-serif text-lg mb-2 heading-serif">{item.title}</h3>
                  <p className="text-ocean-pale leading-relaxed flex-grow text-sm">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section className="py-16 bg-neutral-off">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-ocean-deep mb-4">
                Recent Writing
              </h2>
              <p className="text-lg text-ocean-base max-w-2xl mx-auto">
                Latest thoughts on tech, career, and life
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recentPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-all shadow-md hover:shadow-lg group"
              >
                View all posts
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {recentMoments.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-ocean-dark to-ocean-base text-neutral-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                Life Beyond Code
              </h2>
              <p className="text-lg text-ocean-pale max-w-2xl mx-auto">
                Scuba dives, bike rides, travel moments, and reflections
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recentMoments.map((moment, index) => (
                <LifeMomentCard key={moment.id} moment={moment} index={index} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/life"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-white text-teal-base rounded-lg font-medium hover:bg-teal-base hover:text-neutral-white transition-all shadow-md hover:shadow-lg border-2 border-neutral-white group"
              >
                Explore more moments
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {aboutTeaser && (
        <section className="py-16 bg-neutral-off">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="bg-neutral-white rounded-xl p-8 md:p-10 shadow-lg border border-ocean-light/10">
                <h2 className="font-serif text-3xl md:text-4xl text-ocean-deep mb-4">
                  About Me
                </h2>
                <p className="text-ocean-base text-lg leading-relaxed mb-6">
                  {aboutTeaser}
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-all shadow-md hover:shadow-lg group"
                >
                  Read my full story
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      <section className="py-20 bg-gradient-to-br from-ocean-dark to-ocean-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup source="homepage" />
        </div>
      </section>
    </div>
  )
}
