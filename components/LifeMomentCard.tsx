'use client'

import { LifeMoment } from '@/types'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { YouTubeEmbed } from './YouTubeEmbed'
import Image from 'next/image'

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/20 hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-teal-base uppercase tracking-wide">
          {typeLabels[moment.type]}
        </span>
        <span className="text-xs text-ocean-light">
          {format(new Date(moment.date), 'MMM d, yyyy')}
        </span>
      </div>
      <h3 className="font-serif text-xl text-ocean-deep mb-2">{moment.title}</h3>
      <p className="text-ocean-base mb-3">{moment.description}</p>
      {moment.location && (
        <p className="text-sm text-ocean-light mb-3">📍 {moment.location}</p>
      )}
      {moment.image && (
        <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden bg-ocean-pale/10">
          <Image
            src={moment.image}
            alt={moment.title}
            fill
            className="object-cover"
            unoptimized={moment.image.includes('supabase.co')}
          />
        </div>
      )}
      {moment.videoUrl && (
        <div className="mt-3">
          <YouTubeEmbed videoId={moment.videoUrl} />
        </div>
      )}
    </motion.div>
  )
}

