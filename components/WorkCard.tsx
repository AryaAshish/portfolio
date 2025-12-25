'use client'

import { WorkExperience } from '@/types'
import { motion } from 'framer-motion'

interface WorkCardProps {
  work: WorkExperience
  index: number
}

export function WorkCard({ work, index }: WorkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="card-hover bg-neutral-white rounded-xl p-6 md:p-8 shadow-lg border border-ocean-light/20"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
        <div>
          <h3 className="font-serif text-2xl text-ocean-deep mb-1">{work.role}</h3>
          <p className="text-ocean-base font-medium">{work.company}</p>
          {work.location && (
            <p className="text-sm text-ocean-light mt-1">{work.location}</p>
          )}
        </div>
        <p className="text-sm text-ocean-light mt-2 md:mt-0">{work.period}</p>
      </div>

      {work.metrics && work.metrics.length > 0 && (
        <div className="mb-4 p-4 bg-teal-light/10 rounded-lg">
          <p className="text-sm font-semibold text-teal-dark mb-2">Key Metrics:</p>
          <ul className="list-disc list-inside text-sm text-ocean-base space-y-1">
            {work.metrics.map((metric, idx) => (
              <li key={idx}>{metric}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm font-semibold text-ocean-deep mb-2">Impact:</p>
        <ul className="list-disc list-inside text-sm text-ocean-base space-y-1">
          {work.impact.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-ocean-deep mb-2">Technologies:</p>
        <div className="flex flex-wrap gap-2">
          {work.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-ocean-pale/20 text-ocean-base rounded-full text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

