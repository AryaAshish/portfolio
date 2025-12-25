'use client'

import { motion } from 'framer-motion'

interface RideRouteProps {
  from: string
  to: string
  distance?: number
  duration?: string
  stops?: string[]
  date?: string
  elevation?: number
}

export function RideRoute({
  from,
  to,
  distance,
  duration,
  stops = [],
  date,
  elevation,
}: RideRouteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-8 rounded-xl overflow-hidden shadow-lg border border-orange-300/30 bg-gradient-to-br from-orange-50 to-amber-50"
    >
      <div className="p-6 bg-gradient-to-r from-orange-400/20 to-amber-400/20 border-b border-orange-300/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🏍️</span>
          <div className="flex-1">
            <h3 className="font-serif text-xl text-ocean-deep heading-serif">Ride Route</h3>
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
        </div>

        <div className="flex items-center gap-3 text-ocean-deep">
          <div className="flex-1 text-center p-3 bg-white/50 rounded-lg">
            <div className="text-sm text-ocean-base/70 mb-1">From</div>
            <div className="font-semibold">{from}</div>
          </div>
          <div className="text-2xl text-orange-500">→</div>
          <div className="flex-1 text-center p-3 bg-white/50 rounded-lg">
            <div className="text-sm text-ocean-base/70 mb-1">To</div>
            <div className="font-semibold">{to}</div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {distance !== undefined && (
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{distance} km</div>
            <div className="text-xs text-ocean-base/70 mt-1">Distance</div>
          </div>
        )}
        {duration && (
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{duration}</div>
            <div className="text-xs text-ocean-base/70 mt-1">Duration</div>
          </div>
        )}
        {elevation !== undefined && (
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{elevation}m</div>
            <div className="text-xs text-ocean-base/70 mt-1">Elevation</div>
          </div>
        )}
      </div>

      {stops.length > 0 && (
        <div className="px-6 pb-6 border-t border-orange-300/20 pt-4">
          <h4 className="text-sm font-semibold text-ocean-deep mb-3 uppercase tracking-wide">Stops</h4>
          <div className="space-y-2">
            {stops.map((stop, index) => (
              <div key={index} className="flex items-center gap-2 text-ocean-base">
                <span className="w-6 h-6 rounded-full bg-orange-400/30 flex items-center justify-center text-xs font-semibold text-orange-600">
                  {index + 1}
                </span>
                <span>{stop}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}


