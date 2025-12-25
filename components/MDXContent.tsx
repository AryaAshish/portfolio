'use client'

import { useEffect, useState } from 'react'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import {
  JourneyMap,
  DiveLog,
  RideRoute,
  CodeFromLocation,
  JourneyStats,
  LocationCard,
  StoryTimeline,
  TimelineEvent,
} from '@/components/blog'

const components = {
  JourneyMap,
  DiveLog,
  RideRoute,
  CodeFromLocation,
  JourneyStats,
  LocationCard,
  StoryTimeline,
  TimelineEvent,
}

interface MDXContentProps {
  content: string
}

export function MDXContent({ content }: MDXContentProps) {
  const [mdxComponent, setMdxComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    evaluate(content, {
      ...runtime,
      development: false,
    })
      .then(({ default: Component }) => {
        setMdxComponent(() => Component)
      })
      .catch((err) => {
        console.error('MDX compilation error:', err)
        setError(err.message)
      })
  }, [content])

  if (error) {
    return <div className="text-red-500">Error rendering MDX content: {error}</div>
  }

  if (!mdxComponent) {
    return <div className="text-ocean-base p-4 bg-ocean-pale/10 rounded-lg">Loading content...</div>
  }

  const Component = mdxComponent as React.ComponentType<{ components?: any }>
  return <Component components={components} />
}
