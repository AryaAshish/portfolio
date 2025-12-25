import { getAboutTimeline, AboutTimelineEvent } from '@/lib/content'
import { AnimatedHeader } from '@/components/AnimatedHeader'
import { AnimatedSection } from '@/components/AnimatedSection'
import { TimelineAboutCard } from '@/components/TimelineAboutCard'

export const metadata = {
  title: 'About Me',
  description: 'Personal journey, career timeline, and values',
}

export default async function AboutPage() {
  const timelineEvents = getAboutTimeline()

  return (
    <div className="min-h-screen bg-neutral-off">
      <section className="py-20 bg-gradient-to-b from-ocean-deep to-ocean-dark text-neutral-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedHeader
            title="About Me"
            subtitle="A narrative, not a resume. Here&apos;s my story."
          />
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-b from-ocean-dark to-neutral-off">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-serif text-4xl text-neutral-white mb-3">My Journey</h2>
            <p className="text-ocean-pale text-lg">
              A chronological timeline of my personal and professional growth
            </p>
          </div>

          <div className="space-y-0">
            {timelineEvents.map((event, idx) => (
              <TimelineAboutCard 
                key={idx} 
                event={event} 
                index={idx} 
                isLast={idx === timelineEvents.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values & Philosophy */}
      <section className="py-20 bg-neutral-off">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="font-serif text-4xl text-ocean-deep mb-8">Values & Philosophy</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/10">
                <h3 className="font-serif text-xl text-ocean-deep mb-3">Code Quality</h3>
                <p className="text-ocean-base">
                  Write code that your future self will thank you for. Clean, readable, and
                  maintainable.
                </p>
              </div>
              <div className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/10">
                <h3 className="font-serif text-xl text-ocean-deep mb-3">Continuous Learning</h3>
                <p className="text-ocean-base">
                  Technology evolves. So should we. Stay curious, stay humble, keep learning.
                </p>
              </div>
              <div className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/10">
                <h3 className="font-serif text-xl text-ocean-deep mb-3">Work-Life Balance</h3>
                <p className="text-ocean-base">
                  Sustainable pace over burnout. Life beyond code makes us better engineers.
                </p>
              </div>
              <div className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/10">
                <h3 className="font-serif text-xl text-ocean-deep mb-3">Impact Over Ego</h3>
                <p className="text-ocean-base">
                  The best solution wins, not the one I came up with. Collaboration over
                  competition.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interests Beyond Code */}
      <section className="py-20 bg-gradient-to-br from-ocean-dark to-ocean-base text-neutral-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="font-serif text-4xl mb-8">Interests Beyond Code</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-ocean-dark/50 rounded-xl p-6 border border-ocean-base/30">
                <h3 className="font-serif text-xl mb-3">🌊 Scuba Diving</h3>
                <p className="text-ocean-pale">
                  PADI Open Water Certified. Exploring the underwater world, one dive at a time.
                </p>
              </div>
              <div className="bg-ocean-dark/50 rounded-xl p-6 border border-ocean-base/30">
                <h3 className="font-serif text-xl mb-3">🏍️ Motorcycles</h3>
                <p className="text-ocean-pale">
                  BMW G 310 GS rider. Mountains, roads, and the freedom of two wheels.
                </p>
              </div>
              <div className="bg-ocean-dark/50 rounded-xl p-6 border border-ocean-base/30">
                <h3 className="font-serif text-xl mb-3">✍️ Writing</h3>
                <p className="text-ocean-pale">
                  Tech insights, travel reflections, and thoughts on building better systems.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

