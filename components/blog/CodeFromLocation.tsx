'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface CodeFromLocationProps {
  location: string
  date?: string
  language?: string
  children: React.ReactNode
}

export function CodeFromLocation({
  location,
  date,
  language = 'typescript',
  children,
}: CodeFromLocationProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-8 rounded-xl overflow-hidden shadow-lg border border-ocean-light/20 bg-gradient-to-br from-ocean-deep to-ocean-dark"
    >
      <div className="p-4 bg-ocean-dark/50 border-b border-ocean-base/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💻</span>
          <div>
            <div className="text-sm font-semibold text-teal-light">{location}</div>
            {date && (
              <div className="text-xs text-ocean-pale/70">
                {new Date(date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-ocean-base/50 text-ocean-pale text-xs rounded">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-teal-base/20 hover:bg-teal-base/30 text-teal-light text-xs rounded transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="p-5 bg-ocean-deep text-ocean-pale font-mono text-sm overflow-x-auto">
        <pre className="m-0">
          <code>{children}</code>
        </pre>
      </div>
    </motion.div>
  )
}


