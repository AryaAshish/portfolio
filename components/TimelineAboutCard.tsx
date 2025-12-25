'use client'

import { motion } from 'framer-motion'

export interface AboutTimelineEvent {
  year: string
  title: string
  description: string
  type?: 'career' | 'personal' | 'milestone' | 'philosophy'
  icon?: string
}

interface TimelineAboutCardProps {
  event: AboutTimelineEvent
  index: number
  isLast: boolean
}

export function TimelineAboutCard({ event, index, isLast }: TimelineAboutCardProps) {
  const getTypeColor = () => {
    switch (event.type) {
      case 'career':
        return 'teal'
      case 'personal':
        return 'ocean'
      case 'milestone':
        return 'teal'
      default:
        return 'ocean'
    }
  }

  const color = getTypeColor()
  const isCurrent = event.year.toLowerCase().includes('present') || event.year.toLowerCase().includes('current')

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
          <div className={`text-sm font-medium mb-2 ${isCurrent ? 'text-teal-light' : 'text-neutral-white'}`}>
            {event.year}
          </div>
          <div className={`w-4 h-4 rounded-full border-4 ${
            isCurrent 
              ? 'bg-teal-base border-teal-light shadow-lg shadow-teal-base/50' 
              : color === 'teal'
              ? 'bg-teal-light border-teal-base'
              : 'bg-ocean-pale border-ocean-light'
          }`} />
        </div>
        
        {/* Vertical Line */}
        {!isLast && (
          <div className={`absolute top-24 right-[7px] w-0.5 h-full bg-gradient-to-b ${
            color === 'teal'
              ? 'from-teal-light via-teal-base/50 to-transparent'
              : 'from-ocean-light via-ocean-pale to-transparent'
          }`} />
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
              : color === 'teal'
              ? 'border-teal-base/20'
              : 'border-ocean-light/20'
          }`}
        >
          {/* Header */}
          <div className="mb-4">
            {isCurrent && (
              <span className="inline-block px-3 py-1 bg-teal-base/10 text-teal-base text-xs font-semibold rounded-full mb-3">
                Current
              </span>
            )}
            {event.type && (
              <span className={`inline-block px-3 py-1 ${
                event.type === 'career' 
                  ? 'bg-teal-base/10 text-teal-base'
                  : event.type === 'personal'
                  ? 'bg-ocean-pale/20 text-ocean-deep'
                  : 'bg-teal-light/10 text-teal-dark'
              } text-xs font-semibold rounded-full mb-3 mr-2`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </span>
            )}
            <h3 className="font-serif text-2xl md:text-3xl text-ocean-deep mb-3 heading-serif">
              {event.title}
            </h3>
          </div>

          {/* Description */}
          <div className="text-ocean-base leading-relaxed">
            <p className="text-sm md:text-base whitespace-pre-line">{event.description}</p>
          </div>

          {/* Icon */}
          {event.icon && (
            <div className="mt-4 text-2xl">{event.icon}</div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

