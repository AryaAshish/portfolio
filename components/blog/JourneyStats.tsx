'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface JourneyStatsProps {
  countries?: number
  dives?: number
  kilometers?: number
  cities?: number
  rides?: number
}

interface StatItem {
  label: string
  value: number
  icon: string
  color: string
}

export function JourneyStats({
  countries,
  dives,
  kilometers,
  cities,
  rides,
}: JourneyStatsProps) {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})

  const stats: StatItem[] = [
    countries !== undefined && { label: 'Countries', value: countries, icon: '🌍', color: 'text-teal-base' },
    dives !== undefined && { label: 'Dives', value: dives, icon: '🌊', color: 'text-teal-base' },
    kilometers !== undefined && { label: 'Kilometers', value: kilometers, icon: '🏍️', color: 'text-orange-500' },
    cities !== undefined && { label: 'Cities', value: cities, icon: '🏙️', color: 'text-blue-500' },
    rides !== undefined && { label: 'Rides', value: rides, icon: '🛣️', color: 'text-orange-500' },
  ].filter(Boolean) as StatItem[]

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    stats.forEach((stat) => {
      const duration = 2000
      const steps = 60
      const increment = stat.value / steps
      let current = 0
      let step = 0

      const timer = setInterval(() => {
        step++
        current = Math.min(increment * step, stat.value)
        setAnimatedValues((prev) => ({
          ...prev,
          [stat.label]: Math.floor(current),
        }))

        if (step >= steps) {
          clearInterval(timer)
          setAnimatedValues((prev) => ({
            ...prev,
            [stat.label]: stat.value,
          }))
        }
      }, duration / steps)

      timers.push(timer)
    })

    return () => {
      timers.forEach((timer) => clearInterval(timer))
    }
  }, [countries, dives, kilometers, cities, rides])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-8 rounded-xl overflow-hidden shadow-lg border border-ocean-light/20 bg-gradient-to-br from-ocean-pale/10 to-ocean-light/5"
    >
      <div className="p-6">
        <h3 className="font-serif text-2xl text-ocean-deep mb-6 heading-serif text-center">
          Journey Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {animatedValues[stat.label] ?? 0}
                {stat.label === 'Kilometers' && ' km'}
              </div>
              <div className="text-sm text-ocean-base/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

