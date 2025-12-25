import { db } from '@/lib/db'
import { AnimatedHeader } from '@/components/AnimatedHeader'
import Link from 'next/link'
import { PrepPath } from '@/types'

export const metadata = {
  title: 'Prep Paths',
  description: 'Structured learning paths for interview preparation and skill development',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

const categoryLabels: Record<PrepPath['category'], string> = {
  android: 'Android Development',
  'system-design': 'System Design',
  dsa: 'Data Structures & Algorithms',
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  devops: 'DevOps',
  other: 'Other',
}

const difficultyColors: Record<PrepPath['difficulty'], string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

export default async function PrepPathsPage() {
  const paths = await db.prepPaths.getAll()
  const publishedPaths = paths.filter(p => p.published)

  const pathsByCategory = publishedPaths.reduce((acc, path) => {
    if (!acc[path.category]) {
      acc[path.category] = []
    }
    acc[path.category].push(path)
    return acc
  }, {} as Record<string, PrepPath[]>)

  return (
    <div className="min-h-screen bg-neutral-off">
      <section className="py-20 bg-gradient-to-b from-ocean-deep to-ocean-dark text-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedHeader
            title="Prep Paths"
            subtitle="Structured learning paths for interview preparation and skill development"
          />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-ocean-dark to-neutral-off">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {publishedPaths.length > 0 ? (
            <div className="space-y-12">
              {Object.entries(pathsByCategory).map(([category, categoryPaths]) => (
                <div key={category}>
                  <h2 className="font-serif text-3xl text-ocean-deep mb-6">
                    {categoryLabels[category as PrepPath['category']]}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPaths.map((path) => (
                      <Link
                        key={path.id}
                        href={`/prep/${path.id}`}
                        className="bg-neutral-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-ocean-light/20 group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${path.color}20`, color: path.color }}
                          >
                            {path.icon || '📚'}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[path.difficulty]}`}
                          >
                            {path.difficulty}
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl text-ocean-deep mb-2 group-hover:text-teal-base transition-colors">
                          {path.title}
                        </h3>
                        <p className="text-ocean-base mb-4 line-clamp-3">{path.description}</p>
                        {path.estimatedTime && (
                          <p className="text-sm text-ocean-light">⏱️ {path.estimatedTime}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-white rounded-xl p-12 text-center shadow-lg">
              <p className="text-ocean-base text-lg mb-4">
                Prep paths coming soon. Check back later!
              </p>
              <p className="text-ocean-light">
                Structured learning paths for interview preparation will be available here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

