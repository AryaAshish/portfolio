'use client'

import { motion } from 'framer-motion'

interface DiveLogProps {
  site: string
  depth?: number
  visibility?: number
  temperature?: number
  duration?: string
  highlights?: string[]
  date?: string
  location?: string
}

export function DiveLog({
  site,
  depth,
  visibility,
  temperature,
  duration,
  highlights = [],
  date,
  location,
}: DiveLogProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-8 rounded-xl overflow-hidden shadow-lg border border-teal-light/30 bg-gradient-to-br from-teal-base/10 to-ocean-deep/10"
    >
      <div className="p-6 bg-gradient-to-r from-teal-base/20 to-ocean-deep/20 border-b border-teal-light/20">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🌊</span>
          <div>
            <h3 className="font-serif text-xl text-ocean-deep heading-serif">{site}</h3>
            {location && (
              <p className="text-sm text-ocean-base/70">{location}</p>
            )}
          </div>
        </div>
        {date && (
          <p className="text-sm text-ocean-base/70 mt-1">
            {new Date(date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
      </div>

      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {depth !== undefined && (
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-base">{depth}m</div>
            <div className="text-xs text-ocean-base/70 mt-1">Depth</div>
          </div>
        )}
        {visibility !== undefined && (
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-base">{visibility}m</div>
            <div className="text-xs text-ocean-base/70 mt-1">Visibility</div>
          </div>
        )}
        {temperature !== undefined && (
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-base">{temperature}°C</div>
            <div className="text-xs text-ocean-base/70 mt-1">Temperature</div>
          </div>
        )}
        {duration && (
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-base">{duration}</div>
            <div className="text-xs text-ocean-base/70 mt-1">Duration</div>
          </div>
        )}
      </div>

      {highlights.length > 0 && (
        <div className="px-6 pb-6 border-t border-teal-light/20 pt-4">
          <h4 className="text-sm font-semibold text-ocean-deep mb-3 uppercase tracking-wide">Highlights</h4>
          <div className="flex flex-wrap gap-2">
            {highlights.map((highlight, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-teal-base/20 text-ocean-deep rounded-full text-sm"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}


