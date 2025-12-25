'use client'

import { useMemo } from 'react'
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
  const Component = useMemo(() => {
    try {
      const { default: MDXComponent } = evaluate(content, {
        ...runtime,
        development: false,
      })
      return MDXComponent
    } catch (error) {
      console.error('MDX compilation error:', error)
      return () => <div className="text-red-500">Error rendering MDX content</div>
    }
  }, [content])

  return <Component components={components} />
}


