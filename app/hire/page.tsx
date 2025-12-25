import { getWorkExperience, getSkills } from '@/lib/content'
import { getHireContent } from '@/lib/hire'
import Link from 'next/link'

export const metadata = {
  title: 'Hiring? Quick View - Musafir',
  description: 'Senior Android Engineer | Backend Systems | 8+ Years Experience | Available for Senior Engineering Roles',
}

export default async function HirePage() {
  const [workExperience, skills, hireContent] = await Promise.all([
    getWorkExperience(),
    getSkills(),
    getHireContent(),
  ])
  
  // Get top 3 most recent experiences
  const topExperiences = workExperience.slice(0, 3)
  
  // Calculate total years of experience from work history
  const calculateYearsOfExperience = () => {
    if (workExperience.length === 0) return hireContent.summary.yearsOfExperience
    
    const sortedExp = [...workExperience].sort((a, b) => {
      const aStart = new Date(a.period.split(' - ')[0]).getTime()
      const bStart = new Date(b.period.split(' - ')[0]).getTime()
      return aStart - bStart
    })
    
    const earliestStart = new Date(sortedExp[0].period.split(' - ')[0])
    const now = new Date()
    const years = (now.getTime() - earliestStart.getTime()) / (1000 * 60 * 60 * 24 * 365)
    return Math.round(years * 10) / 10
  }

  const yearsOfExp = calculateYearsOfExperience()

  // Flatten all skills for ATS keyword matching
  const allSkills = skills.flatMap(skill => skill.items || [])
  const topSkills = allSkills.slice(0, 20)

  // Structured data for ATS/SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ashish Aryan",
    "jobTitle": hireContent.summary.currentRole || "Senior Software Engineer",
    "email": hireContent.contact.email,
    "telephone": hireContent.contact.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": hireContent.contact.location
    },
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://musafir.codes",
    "sameAs": [
      "https://github.com/yourusername",
      "https://linkedin.com/in/yourusername"
    ],
    "knowsAbout": topSkills,
    "hasOccupation": {
      "@type": "Occupation",
      "name": hireContent.summary.currentRole || "Senior Software Engineer",
      "occupationLocation": {
        "@type": "City",
        "name": hireContent.contact.location
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-neutral-off">
        {/* Header - Hero Section */}
        <header className="bg-gradient-to-b from-ocean-deep to-ocean-dark text-neutral-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 whitespace-pre-line">
                {hireContent.hero.title}
              </h1>
              <p className="text-xl text-neutral-white/90 mb-6">
                {hireContent.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/api/resume/download"
                  download="Ashish_Aryan_Resume.pdf"
                  className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
                  aria-label="Download Resume PDF"
                >
                  Download Resume (PDF)
                </a>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-transparent border-2 border-neutral-white text-neutral-white rounded-lg font-medium hover:bg-neutral-white hover:text-ocean-deep transition-colors"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Professional Summary - ATS Friendly */}
        <section className="py-12 bg-gradient-to-b from-ocean-dark to-neutral-off" itemScope itemType="https://schema.org/Person">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-neutral-white mb-6">Professional Summary</h2>
            <div className="bg-neutral-white rounded-xl p-6 mb-6 shadow-lg border border-ocean-light/20">
              <div className="grid md:grid-cols-2 gap-6 text-ocean-base">
                <div>
                  <p className="mb-2">
                    <span className="font-semibold">Experience: </span>
                    <span itemProp="knowsAbout">{yearsOfExp}+ years</span> in software engineering
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Current Role: </span>
                    <span itemProp="jobTitle">{hireContent.summary.currentRole || 'Senior Software Engineer'}</span>
                  </p>
                </div>
                <div>
                  <p className="mb-2">
                    <span className="font-semibold">Location: </span>
                    <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                      <span itemProp="addressLocality">{hireContent.summary.location}</span>
                    </span>
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Availability: </span>
                    {hireContent.summary.availability}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information - Plain Text for ATS */}
            <div className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/20">
              <h3 className="font-semibold text-ocean-deep mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-ocean-base">
                <div>
                  <span className="font-semibold">Email: </span>
                  <a 
                    href={`mailto:${hireContent.contact.email}`}
                    itemProp="email"
                    className="text-teal-base hover:text-teal-dark break-all"
                  >
                    {hireContent.contact.email}
                  </a>
                </div>
                <div>
                  <span className="font-semibold">Phone: </span>
                  <a 
                    href={`tel:${hireContent.contact.phone.replace(/\s/g, '')}`}
                    itemProp="telephone"
                    className="text-teal-base hover:text-teal-dark"
                  >
                    {hireContent.contact.phone}
                  </a>
                </div>
                <div>
                  <span className="font-semibold">Location: </span>
                  <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <span itemProp="addressLocality">{hireContent.contact.location}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Competencies - ATS Keywords */}
        <section className="py-12 bg-neutral-off">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-ocean-deep mb-6">Core Competencies</h2>
            <div className="bg-neutral-white rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {skills.slice(0, 6).map((skill, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-ocean-base mb-2">{skill.category}</h3>
                    <p className="text-sm text-ocean-base/80">
                      {(skill.items || []).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
              {topSkills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-ocean-light">
                  <p className="text-xs text-ocean-base/60 mb-2">Key Technologies:</p>
                  <p className="text-sm text-ocean-base/80">
                    {topSkills.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recent Work Experience */}
        <section className="py-12 bg-neutral-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl text-ocean-deep mb-8">Recent Work Experience</h2>
            <div className="space-y-6">
              {topExperiences.map((work, idx) => (
                <article 
                  key={idx} 
                  className="bg-neutral-off rounded-lg p-6 shadow-sm"
                  itemScope 
                  itemType="https://schema.org/OrganizationRole"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-2xl text-ocean-deep mb-1" itemProp="roleName">
                        {work.role}
                      </h3>
                      <p className="text-teal-base font-medium" itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
                        <span itemProp="name">{work.company}</span>
                      </p>
                      <p className="text-sm text-ocean-base/70 mt-1">
                        <span itemProp="startDate">{work.period.split(' - ')[0]}</span>
                        {work.period.includes(' - ') && work.period.split(' - ')[1] !== 'Present' && (
                          <> - <span itemProp="endDate">{work.period.split(' - ')[1]}</span></>
                        )}
                        {work.location && <> • {work.location}</>}
                      </p>
                    </div>
                  </div>
                  
                  {work.impact && work.impact.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-ocean-base mb-2">Key Achievements:</h4>
                      <ul className="space-y-1">
                        {work.impact.slice(0, 4).map((impact, i) => (
                          <li key={i} className="text-ocean-base text-sm flex items-start">
                            <span className="text-teal-base mr-2">•</span>
                            <span>{impact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {work.technologies && work.technologies.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-ocean-base/60 mb-1">Technologies Used:</p>
                      <p className="text-sm text-ocean-base/80">
                        {work.technologies.join(', ')}
                      </p>
                    </div>
                  )}

                  {work.metrics && work.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {work.metrics.slice(0, 3).map((metric, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 bg-teal-base/10 text-teal-base rounded-full text-sm font-medium"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
            
            {workExperience.length > 3 && (
              <div className="mt-8 text-center">
                <Link
                  href="/experience"
                  className="text-teal-base hover:text-teal-dark font-medium"
                >
                  View Full Experience History →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 bg-ocean-deep text-neutral-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl mb-4">
              {hireContent.cta.title}
            </h2>
            <p className="text-lg text-neutral-white/90 mb-6">
              {hireContent.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
              >
                Contact Me
              </Link>
              <a
                href="/api/resume/download"
                download="Ashish_Aryan_Resume.pdf"
                className="px-8 py-3 bg-transparent border-2 border-neutral-white text-neutral-white rounded-lg font-medium hover:bg-neutral-white hover:text-ocean-deep transition-colors"
                aria-label="Download Resume PDF"
              >
                Download Resume (PDF)
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
