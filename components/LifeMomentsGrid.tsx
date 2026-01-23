'use client'

import { useState } from 'react'
import { LifeMoment } from '@/types'
import { LifeMomentCard } from './LifeMomentCard'
import { motion } from 'framer-motion'

interface LifeMomentsGridProps {
  moments: LifeMoment[]
}

const categories = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'scuba', label: 'Scuba Diving', icon: '🌊' },
  { id: 'motorcycle', label: 'Motorcycles', icon: '🏍️' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'tech', label: 'Tech Events', icon: '💻' },
  { id: 'reflection', label: 'Reflections', icon: '💭' },
]

export function LifeMomentsGrid({ moments }: LifeMomentsGridProps) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredMoments = activeFilter === 'all' 
    ? moments 
    : moments.filter(m => m.type === activeFilter)

  return (
    <div>
      {/* Filter Buttons */}
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeFilter === category.id
                ? 'bg-teal-base text-neutral-white shadow-lg scale-105'
                : 'bg-neutral-white text-ocean-base hover:bg-ocean-pale/20 hover:scale-105'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <motion.div
        key={activeFilter}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="text-ocean-pale text-lg">
          {filteredMoments.length} {filteredMoments.length === 1 ? 'moment' : 'moments'}
          {activeFilter !== 'all' && ` in ${categories.find(c => c.id === activeFilter)?.label}`}
        </p>
      </motion.div>

      {/* Grid */}
      {filteredMoments.length > 0 ? (
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredMoments.map((moment, idx) => (
            <LifeMomentCard key={moment.id} moment={moment} index={idx} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-neutral-white rounded-xl p-12 text-center shadow-lg"
        >
          <p className="text-ocean-base text-lg">
            No moments in this category yet. Check back later!
          </p>
        </motion.div>
      )}
    </div>
  )
}
