'use client'

import { motion } from 'framer-motion'

interface LocationCardProps {
  name: string
  coordinates?: [number, number]
  date?: string
  type?: 'dive' | 'ride' | 'work' | 'personal'
  narrative?: string
}

export function LocationCard({
  name,
  coordinates,
  date,
  type = 'personal',
  narrative,
}: LocationCardProps) {
  const typeColors = {
    dive: 'from-teal-base/20 to-ocean-deep/10 border-teal-light/30',
    ride: 'from-orange-50 to-amber-50 border-orange-300/30',
    work: 'from-blue-50 to-indigo-50 border-blue-300/30',
    personal: 'from-purple-50 to-pink-50 border-purple-300/30',
  }

  const typeIcons = {
    dive: '🌊',
    ride: '🏍️',
    work: '💻',
    personal: '📍',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`my-8 rounded-xl overflow-hidden shadow-lg border bg-gradient-to-br ${typeColors[type]}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{typeIcons[type]}</span>
          <div className="flex-1">
            <h3 className="font-serif text-xl text-ocean-deep heading-serif">{name}</h3>
            {date && (
              <p className="text-sm text-ocean-base/70 mt-1">
                {new Date(date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
            {coordinates && (
              <p className="text-xs text-ocean-base/50 mt-1">
                {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
              </p>
            )}
          </div>
        </div>
        {narrative && (
          <p className="text-ocean-base leading-relaxed">{narrative}</p>
        )}
      </div>
    </motion.div>
  )
}


