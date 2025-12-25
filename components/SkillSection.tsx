'use client'

import { Skill } from '@/types'
import { motion } from 'framer-motion'

interface SkillSectionProps {
  skills: Skill[]
}

export function SkillSection({ skills }: SkillSectionProps) {
  return (
    <div className="space-y-8">
      {skills.map((skillGroup, groupIdx) => (
        <motion.div
          key={skillGroup.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIdx * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="card-hover bg-neutral-white rounded-xl p-6 md:p-8 shadow-lg border border-ocean-light/20"
        >
          <h3 className="font-serif text-2xl md:text-3xl text-ocean-deep mb-6 heading-serif">{skillGroup.category}</h3>
          <div className="flex flex-wrap gap-3">
            {(skillGroup.items || []).map((item, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-ocean-pale/20 text-ocean-base rounded-full text-sm font-medium hover:bg-teal-light/20 hover:text-teal-dark transition-all cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

