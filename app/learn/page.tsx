import { getCourses } from '@/lib/content'
import { CourseCard } from '@/components/CourseCard'
import { AnimatedHeader } from '@/components/AnimatedHeader'

export const metadata = {
  title: 'Courses',
  description: 'Learn from practical courses on engineering, systems design, and career growth',
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-neutral-off">
      <section className="py-20 bg-gradient-to-b from-ocean-deep to-ocean-dark text-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedHeader
            title="Learn"
            subtitle="Practical courses on engineering, systems design, and career growth"
          />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-ocean-dark to-neutral-off">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, idx) => (
                <CourseCard key={course.id} course={course} index={idx} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-white rounded-xl p-12 text-center shadow-lg">
              <p className="text-ocean-base text-lg mb-4">
                Courses coming soon. Check back later!
              </p>
              <p className="text-ocean-light">
                This architecture is ready for when you&apos;re ready to launch paid content.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

