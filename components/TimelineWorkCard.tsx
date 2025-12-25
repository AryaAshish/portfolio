'use client'

import { WorkExperience } from '@/types'
import { motion } from 'framer-motion'

interface TimelineWorkCardProps {
  work: WorkExperience
  index: number
  isLast: boolean
}

export function TimelineWorkCard({ work, index, isLast }: TimelineWorkCardProps) {
  const isCurrent = work.period.toLowerCase().includes('present')
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-8"
    >
      {/* Timeline Line */}
      <div className="flex-shrink-0 w-32 relative">
        <div className="sticky top-24 flex flex-col items-end">
          <div className={`text-sm font-medium mb-2 ${isCurrent ? 'text-teal-base' : 'text-ocean-light'}`}>
            {work.period}
          </div>
          <div className={`w-4 h-4 rounded-full border-4 ${
            isCurrent 
              ? 'bg-teal-base border-teal-light shadow-lg shadow-teal-base/50' 
              : 'bg-ocean-pale border-ocean-light'
          }`} />
        </div>
        
        {/* Vertical Line */}
        {!isLast && (
          <div className="absolute top-24 right-[7px] w-0.5 h-full bg-gradient-to-b from-ocean-light via-ocean-pale to-transparent" />
        )}
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-12">
        <motion.div
          whileHover={{ scale: 1.01, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          transition={{ duration: 0.2 }}
          className={`bg-neutral-white rounded-xl p-6 md:p-8 shadow-lg border-2 ${
            isCurrent 
              ? 'border-teal-base/30' 
              : 'border-ocean-light/20'
          }`}
        >
          {/* Header */}
          <div className="mb-6">
            {isCurrent && (
              <span className="inline-block px-3 py-1 bg-teal-base/10 text-teal-base text-xs font-semibold rounded-full mb-3">
                Current
              </span>
            )}
            <h3 className="font-serif text-2xl md:text-3xl text-ocean-deep mb-2 heading-serif">
              {work.role}
            </h3>
            <div className="flex flex-col md:flex-row md:items-center md:gap-3 text-ocean-base">
              <p className="font-semibold text-lg">{work.company}</p>
              {work.location && (
                <>
                  <span className="hidden md:inline text-ocean-light">•</span>
                  <p className="text-sm text-ocean-light flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {work.location}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          {work.metrics && work.metrics.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {work.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-light/10 rounded-lg border border-teal-base/20"
                >
                  <svg className="w-4 h-4 text-teal-base flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-xs font-medium text-ocean-deep">{metric}</span>
                </div>
              ))}
            </div>
          )}

          {/* Impact */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-ocean-deep mb-3 uppercase tracking-wide">Impact & Achievements</h4>
            <ul className="space-y-2">
              {work.impact.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-ocean-base">
                  <svg className="w-5 h-5 text-teal-base flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-sm font-semibold text-ocean-deep mb-3 uppercase tracking-wide">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {work.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-ocean-pale/20 text-ocean-deep rounded-lg text-xs font-medium hover:bg-teal-light/20 hover:text-teal-dark transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}


