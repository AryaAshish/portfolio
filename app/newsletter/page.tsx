import { NewsletterSignup } from '@/components/NewsletterSignup'
import { AnimatedHeader } from '@/components/AnimatedHeader'
import { AnimatedSection } from '@/components/AnimatedSection'

export const metadata = {
  title: 'Newsletter',
  description: 'Join the newsletter for short, practical notes on engineering, careers, and building calm systems',
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-neutral-off">
      <section className="py-20 bg-gradient-to-b from-ocean-deep to-ocean-dark text-neutral-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedHeader
            title="Join the Newsletter"
            subtitle="Short, practical notes on engineering, careers, and building calm systems — no spam."
          />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-ocean-dark to-neutral-off">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup source="newsletter-page" />
        </div>
      </section>

      <section className="py-20 bg-neutral-off">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-neutral-white rounded-xl p-8 shadow-lg">
            <h2 className="font-serif text-3xl text-ocean-deep mb-4">What You&apos;ll Get</h2>
            <ul className="space-y-3 text-ocean-base">
              <li className="flex items-start">
                <span className="text-teal-base mr-3">✓</span>
                <span>
                  Weekly insights on Android development, backend systems, and architecture
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-base mr-3">✓</span>
                <span>Career advice and lessons learned from building real products</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-base mr-3">✓</span>
                <span>System design thinking and scalability patterns</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-base mr-3">✓</span>
                <span>Occasional reflections on travel, scuba diving, and life beyond code                </span>
              </li>
            </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

