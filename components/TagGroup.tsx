'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface TagGroupProps {
  mainTag: string
  childTags: string[]
  mainTagSlug: string
}

export function TagGroup({ mainTag, childTags, mainTagSlug }: TagGroupProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-neutral-white text-ocean-deep rounded-lg text-sm font-medium hover:bg-teal-base hover:text-neutral-white transition-colors shadow-md border border-ocean-light/20 relative"
      >
        {mainTag}
        <svg
          className="inline-block ml-1 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 z-20 bg-neutral-white rounded-lg shadow-xl border border-ocean-light/20 p-4 min-w-[200px] max-w-[300px]"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="mb-2 pb-2 border-b border-ocean-light/20">
                <Link
                  href={`/blog/tag/${mainTagSlug}`}
                  className="font-semibold text-ocean-deep hover:text-teal-base transition-colors"
                >
                  {mainTag}
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {childTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag}`}
                    className="px-3 py-1 bg-ocean-pale/10 text-ocean-base rounded text-xs font-medium hover:bg-teal-base hover:text-neutral-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

