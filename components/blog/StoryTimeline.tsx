'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TimelineEventProps {
  date: string
  location: string
  children: ReactNode
}

export function TimelineEvent({ date, location, children }: TimelineEventProps) {
  return (
    <div className="relative pl-8 pb-8 border-l-2 border-teal-base/30 last:border-l-0 last:pb-0">
      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-teal-base border-2 border-white shadow-lg" />
      <div className="mb-2">
        <div className="text-sm font-semibold text-teal-base">{location}</div>
        <div className="text-xs text-ocean-base/70">
          {new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      <div className="text-ocean-base leading-relaxed">{children}</div>
    </div>
  )
}

interface StoryTimelineProps {
  children: ReactNode
}

export function StoryTimeline({ children }: StoryTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-8 rounded-xl overflow-hidden shadow-lg border border-ocean-light/20 bg-gradient-to-br from-ocean-pale/10 to-ocean-light/5 p-6"
    >
      <h3 className="font-serif text-2xl text-ocean-deep mb-6 heading-serif">Timeline</h3>
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}


