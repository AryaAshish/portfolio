'use client'

import { motion } from 'framer-motion'

interface AnimatedHeaderProps {
  title: string
  subtitle: string
}

export function AnimatedHeader({ title, subtitle }: AnimatedHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 heading-serif">{title}</h1>
      <p className="text-xl md:text-2xl text-ocean-pale leading-relaxed">{subtitle}</p>
    </motion.div>
  )
}


