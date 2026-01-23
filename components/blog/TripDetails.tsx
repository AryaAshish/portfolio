'use client'

import { motion } from 'framer-motion'

interface TripDetailsProps {
  duration?: string
  route?: string
  stay?: string
  weather?: string
  cost?: string
  distance?: string
  companions?: string
}

export function TripDetails({
  duration,
  route,
  stay,
  weather,
  cost,
  distance,
  companions,
}: TripDetailsProps) {
  const details = [
    { label: 'Duration', value: duration, icon: '📅' },
    { label: 'Route', value: route, icon: '🗺️' },
    { label: 'Stay', value: stay, icon: '🏨' },
    { label: 'Weather', value: weather, icon: '🌡️' },
    { label: 'Cost', value: cost, icon: '💰' },
    { label: 'Distance', value: distance, icon: '🚗' },
    { label: 'Companions', value: companions, icon: '👥' },
  ].filter(detail => detail.value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-8 rounded-xl overflow-hidden shadow-lg border border-ocean-light/20 bg-white"
    >
      <div className="p-6 bg-ocean-pale/30 border-b border-ocean-light/20">
        <h3 className="font-serif text-xl text-ocean-deep heading-serif flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          Trip Details
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-2xl mt-1">{detail.icon}</span>
              <div>
                <div className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
                  {detail.label}
                </div>
                <div className="text-sm text-gray-800 font-medium">
                  {detail.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
