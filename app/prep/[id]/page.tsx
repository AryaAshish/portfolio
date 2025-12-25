import { db } from '@/lib/db'
import { AnimatedHeader } from '@/components/AnimatedHeader'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PrepPath, PrepTopic, PrepQuestion, PrepResource } from '@/types'
import { QuestionAccordion } from '@/components/QuestionAccordion'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const difficultyColors: Record<PrepPath['difficulty'], string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}


const resourceTypeIcons: Record<PrepResource['type'], string> = {
  blog: '📝',
  video: '🎥',
  documentation: '📚',
  book: '📖',
  course: '🎓',
  practice: '💻',
}

export default async function PrepPathPage({ params }: { params: { id: string } }) {
  const path = await db.prepPaths.getById(params.id)
  
  if (!path || !path.published) {
    notFound()
  }

  const [topics, pathResources] = await Promise.all([
    db.prepTopics.getByPathId(path.id),
    db.prepResources.getByPathId(path.id),
  ])

  const topicsWithQuestions = await Promise.all(
    topics.map(async (topic) => {
      const [questions, resources] = await Promise.all([
        db.prepQuestions.getByTopicId(topic.id),
        db.prepResources.getByTopicId(topic.id),
      ])
      return { ...topic, questions, resources }
    })
  )

  return (
    <div className="min-h-screen bg-neutral-off">
      <section className="py-20 bg-gradient-to-b from-ocean-deep to-ocean-dark text-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedHeader title={path.title} subtitle={path.description} />
          <div className="flex items-center gap-4 mt-6">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${difficultyColors[path.difficulty]}`}
            >
              {path.difficulty}
            </span>
            {path.estimatedTime && (
              <span className="text-ocean-pale">⏱️ {path.estimatedTime}</span>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-ocean-dark to-neutral-off">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pathResources.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-3xl text-ocean-deep mb-6">General Resources</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pathResources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all border border-ocean-light/20 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{resourceTypeIcons[resource.type]}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-ocean-deep mb-1 group-hover:text-teal-base transition-colors">
                          {resource.title}
                        </h3>
                        {resource.description && (
                          <p className="text-sm text-ocean-base mb-2 line-clamp-2">
                            {resource.description}
                          </p>
                        )}
                        {resource.author && (
                          <p className="text-xs text-ocean-light">by {resource.author}</p>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {topicsWithQuestions.length > 0 && (
            <div className="space-y-8">
              <h2 className="font-serif text-3xl text-ocean-deep mb-6">Topics</h2>
              {topicsWithQuestions.map((topic, topicIndex) => (
                <div
                  key={topic.id}
                  className="bg-neutral-white rounded-xl p-6 md:p-8 shadow-lg border border-ocean-light/20"
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-teal-base">
                        {String(topicIndex + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-serif text-2xl text-ocean-deep">{topic.title}</h3>
                    </div>
                    {topic.description && (
                      <p className="text-ocean-base ml-11">{topic.description}</p>
                    )}
                  </div>

                  {topic.resources && topic.resources.length > 0 && (
                    <div className="mb-6 ml-11">
                      <h4 className="font-semibold text-ocean-deep mb-3">Resources</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {topic.resources.map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-ocean-pale/10 rounded-lg p-3 hover:bg-ocean-pale/20 transition-colors group"
                          >
                            <div className="flex items-center gap-2">
                              <span>{resourceTypeIcons[resource.type]}</span>
                              <span className="text-sm font-medium text-ocean-deep group-hover:text-teal-base transition-colors">
                                {resource.title}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {topic.questions.length > 0 && (
                    <div className="ml-11">
                      <h4 className="font-semibold text-ocean-deep mb-4">
                        Interview Questions ({topic.questions.length})
                      </h4>
                      <div className="space-y-3">
                        {topic.questions.map((question) => (
                          <QuestionAccordion key={question.id} question={question} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {topicsWithQuestions.length === 0 && pathResources.length === 0 && (
            <div className="bg-neutral-white rounded-xl p-12 text-center shadow-lg">
              <p className="text-ocean-base text-lg">
                Content for this prep path is being prepared. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

