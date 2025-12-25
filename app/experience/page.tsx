import { getWorkExperience, getSkills, getExperiencePageContent } from '@/lib/content'
import { TimelineWorkCard } from '@/components/TimelineWorkCard'
import { SkillSection } from '@/components/SkillSection'
import { AnimatedHeader } from '@/components/AnimatedHeader'
import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'

export const metadata = {
  title: 'Experience & Skills',
  description: 'Work experience, skills, and technical expertise',
}

export default async function ExperiencePage() {
  const workExperience = getWorkExperience()
  const skills = getSkills()
  const pageContent = getExperiencePageContent()

  const totalYears = workExperience.length > 0 
    ? new Date().getFullYear() - new Date(workExperience[workExperience.length - 1].period.split(' - ')[0]).getFullYear()
    : 0

  const companiesValue = pageContent.stats.companies.value === 'auto' 
    ? workExperience.length.toString() 
    : pageContent.stats.companies.value

  return (
    <div className="min-h-screen bg-neutral-off">
      <section className="py-20 bg-gradient-to-b from-ocean-deep to-ocean-dark text-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedHeader
            title={pageContent.header.title}
            subtitle={pageContent.header.subtitle}
          />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gradient-to-b from-ocean-dark to-neutral-off">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/20">
                <div className="font-serif text-4xl text-teal-base mb-2">{pageContent.stats.yearsExperience.value}</div>
                <div className="text-sm text-ocean-deep font-medium">{pageContent.stats.yearsExperience.label}</div>
              </div>
              <div className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/20">
                <div className="font-serif text-4xl text-teal-base mb-2">{companiesValue}</div>
                <div className="text-sm text-ocean-deep font-medium">{pageContent.stats.companies.label}</div>
              </div>
              <div className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/20">
                <div className="font-serif text-4xl text-teal-base mb-2">{pageContent.stats.technologies.value}</div>
                <div className="text-sm text-ocean-deep font-medium">{pageContent.stats.technologies.label}</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-neutral-off">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-serif text-4xl text-ocean-deep mb-3">{pageContent.timeline.title}</h2>
            <p className="text-ocean-base text-lg">
              {pageContent.timeline.description}
            </p>
          </div>

          <div className="space-y-0">
            {workExperience.map((work, idx) => (
              <TimelineWorkCard 
                key={idx} 
                work={work} 
                index={idx} 
                isLast={idx === workExperience.length - 1}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/api/resume/download"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Full Resume
            </Link>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-gradient-to-br from-ocean-deep to-ocean-dark text-neutral-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-4xl mb-3">{pageContent.skills.title}</h2>
            <p className="text-ocean-pale text-lg max-w-2xl mx-auto">
              {pageContent.skills.description}
            </p>
          </div>

          <SkillSection skills={skills} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-neutral-off">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-teal-base to-teal-dark rounded-2xl p-8 md:p-12 text-center text-neutral-white shadow-2xl">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">{pageContent.cta.title}</h2>
              <p className="text-ocean-pale text-lg mb-8 max-w-2xl mx-auto">
                {pageContent.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={pageContent.cta.primaryButton.href}
                  className="px-8 py-4 bg-neutral-white text-teal-base rounded-lg font-medium hover:bg-neutral-off transition-colors shadow-lg"
                >
                  {pageContent.cta.primaryButton.text}
                </Link>
                <Link
                  href={pageContent.cta.secondaryButton.href}
                  className="px-8 py-4 bg-transparent border-2 border-neutral-white text-neutral-white rounded-lg font-medium hover:bg-neutral-white/10 transition-colors"
                >
                  {pageContent.cta.secondaryButton.text}
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

