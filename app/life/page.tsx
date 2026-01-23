import { getLifeMoments } from '@/lib/content'
import { LifeMomentsGrid } from '@/components/LifeMomentsGrid'
import { AnimatedHeader } from '@/components/AnimatedHeader'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
            subtitle="Scuba dives, bike rides, travel moments, and reflections from the journey"
          />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-ocean-dark to-neutral-off">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LifeMomentsGrid moments={moments} />
        </div>
      </section>
    </div>
  )
}

