'use client'

import { LifeMoment } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { YouTubeEmbed } from './YouTubeEmbed'
import Image from 'next/image'
import { useState } from 'react'

interface LifeMomentCardProps {
  moment: LifeMoment
  index: number
}

const typeLabels: Record<LifeMoment['type'], string> = {
  scuba: 'Scuba Dive',
  motorcycle: 'Motorcycle Ride',
  travel: 'Travel',
  reflection: 'Reflection',
}

export function LifeMomentCard({ moment, index }: LifeMomentCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="card-hover bg-neutral-white rounded-xl p-6 md:p-8 shadow-lg border border-ocean-light/20 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {moment.image && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-ocean-pale/10">
            <Image
              src={moment.image}
              alt={moment.title}
              fill
              className="object-cover"
              unoptimized={moment.image.includes('supabase.co')}
            />
          </div>
        )}
        <div className="mb-3">
          <span className="text-xs font-semibold text-teal-base uppercase tracking-wide">
            {typeLabels[moment.type]}
          </span>
          <span className="text-xs text-ocean-light mx-2">•</span>
          <span className="text-xs text-ocean-light">
            {format(new Date(moment.date), 'MMM d, yyyy')}
          </span>
          {moment.location && (
            <>
              <span className="text-xs text-ocean-light mx-2">•</span>
              <span className="text-xs text-ocean-light">📍 {moment.location}</span>
            </>
          )}
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-ocean-deep mb-3 hover:text-teal-base transition-colors heading-serif">
          {moment.title}
        </h2>
        <p className="text-ocean-base mb-4 line-clamp-2 leading-relaxed">{moment.description}</p>
        {moment.videoUrl && (
          <div className="mt-4">
            <div className="text-xs text-ocean-light mb-2">📹 Video available</div>
          </div>
        )}
      </motion.article>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ocean-deep/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="sticky top-0 bg-neutral-white border-b border-ocean-light/20 px-6 py-4 flex items-center justify-between z-10">
                  <div>
                    <span className="text-xs font-semibold text-teal-base uppercase tracking-wide">
                      {typeLabels[moment.type]}
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl text-ocean-deep mt-1">
                      {moment.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-ocean-light hover:text-ocean-deep transition-colors p-2"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6 text-sm text-ocean-light">
                    <span>{format(new Date(moment.date), 'MMMM d, yyyy')}</span>
                    {moment.location && (
                      <>
                        <span>•</span>
                        <span>📍 {moment.location}</span>
                      </>
                    )}
                  </div>
                  {moment.image && (
                    <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden bg-ocean-pale/10">
                      <Image
                        src={moment.image}
                        alt={moment.title}
                        fill
                        className="object-cover"
                        unoptimized={moment.image.includes('supabase.co')}
                      />
                    </div>
                  )}
                  <p className="text-ocean-base text-lg leading-relaxed mb-6">{moment.description}</p>
                  {moment.videoUrl && (
                    <div className="mt-6">
                      <YouTubeEmbed videoId={moment.videoUrl} title={moment.title} />
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

