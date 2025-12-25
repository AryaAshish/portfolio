import { getLifeMoments } from '@/lib/content'
import { LifeMomentCard } from '@/components/LifeMomentCard'
import { AnimatedHeader } from '@/components/AnimatedHeader'

export const metadata = {
  title: 'Life Beyond Code',
  description: 'Scuba dives, bike rides, travel moments, and reflections',
}

export default async function LifePage() {
  const moments = await getLifeMoments()

  return (
    <div className="min-h-screen bg-neutral-off">
      <section className="py-20 bg-gradient-to-b from-ocean-deep to-ocean-dark text-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedHeader
            title="Life Beyond Code"
            subtitle="Scuba dives, bike rides, travel moments, and short reflections"
          />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-ocean-dark to-neutral-off">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {moments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {moments.map((moment, idx) => (
                <LifeMomentCard key={moment.id} moment={moment} index={idx} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-white rounded-xl p-12 text-center shadow-lg">
              <p className="text-ocean-base text-lg">
                Life moments coming soon. Check back later!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

