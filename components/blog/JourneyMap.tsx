'use client'

import { motion } from 'framer-motion'

interface JourneyMapProps {
  location: string
  coordinates?: [number, number]
  type?: 'dive' | 'ride' | 'work' | 'personal'
  date?: string
  zoom?: number
}

export function JourneyMap({ 
  location, 
  coordinates, 
  type = 'personal',
  date,
  zoom = 10 
}: JourneyMapProps) {
  const typeColors = {
    dive: 'bg-teal-base',
    ride: 'bg-orange-500',
    work: 'bg-blue-500',
    personal: 'bg-purple-500',
  }

  const typeIcons = {
    dive: '🌊',
    ride: '🏍️',
    work: '💻',
    personal: '📍',
  }

  const mapUrl = coordinates 
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates[1] - 0.1},${coordinates[0] - 0.1},${coordinates[1] + 0.1},${coordinates[0] + 0.1}&layer=mapnik&marker=${coordinates[0]},${coordinates[1]}`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-8 rounded-xl overflow-hidden shadow-lg border border-ocean-light/20 bg-gradient-to-br from-ocean-pale/10 to-ocean-light/5"
    >
      <div className="p-4 bg-ocean-deep/5 border-b border-ocean-light/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeIcons[type]}</span>
          <div className="flex-1">
            <h3 className="font-serif text-lg text-ocean-deep heading-serif">{location}</h3>
            {date && (
              <p className="text-sm text-ocean-base/70">{new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${typeColors[type]}`}>
            {type}
          </span>
        </div>
      </div>
      
      {mapUrl ? (
        <div className="relative w-full h-64">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapUrl}
            className="border-0"
            title={`Map of ${location}`}
          />
          <div className="absolute bottom-2 right-2">
            <a
              href={`https://www.openstreetmap.org/?mlat=${coordinates[0]}&mlon=${coordinates[1]}&zoom=${zoom}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ocean-base/70 hover:text-teal-base transition-colors bg-white/90 px-2 py-1 rounded"
            >
              View larger map
            </a>
          </div>
        </div>
      ) : (
        <div className="h-64 bg-ocean-pale/10 flex items-center justify-center">
          <p className="text-ocean-base/50">Map location: {location}</p>
        </div>
      )}
    </motion.div>
  )
}


