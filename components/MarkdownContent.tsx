'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
import { YouTubeEmbed } from '@/components/YouTubeEmbed'

interface MarkdownContentProps {
  content: string
}

const mdxComponents = {
  JourneyMap,
  DiveLog,
  RideRoute,
  CodeFromLocation,
  JourneyStats,
  LocationCard,
  StoryTimeline,
  TimelineEvent,
  YouTubeEmbed,
  h1: ({ children, ...props }: any) => (
    <h1 className="font-serif text-4xl md:text-5xl text-ocean-deep mb-6 mt-10 heading-serif" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="font-serif text-3xl md:text-4xl text-ocean-deep mb-4 mt-8 heading-serif" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="font-serif text-2xl md:text-3xl text-ocean-deep mb-3 mt-6 heading-serif" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-ocean-base mb-6 leading-relaxed text-lg" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-outside text-ocean-base mb-6 space-y-3 ml-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-outside text-ocean-base mb-6 space-y-3 ml-6" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-ocean-base leading-relaxed" {...props}>
      {children}
    </li>
  ),
  code: ({ children, className, ...props }: any) => {
    const isInline = !className
    if (isInline) {
      return (
        <code
          className="px-2 py-1 bg-ocean-pale/20 text-ocean-deep rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code
        className="block p-5 bg-ocean-deep text-ocean-pale rounded-lg overflow-x-auto text-sm font-mono mb-6 shadow-lg border border-ocean-dark"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: any) => (
    <pre className="mb-6 overflow-x-auto" {...props}>
      {children}
    </pre>
  ),
  a: ({ children, ...props }: any) => (
    <a className="text-teal-base hover:text-teal-dark underline transition-colors" {...props}>
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="border-l-4 border-teal-base pl-6 pr-4 py-6 my-8 bg-gradient-to-r from-ocean-pale/20 via-ocean-pale/10 to-transparent rounded-r-lg shadow-sm backdrop-blur-sm"
      {...props}
    >
      <p className="m-0 italic text-ocean-deep text-lg leading-relaxed font-serif">{children}</p>
    </blockquote>
  ),
  hr: ({ ...props }: any) => (
    <hr className="my-8 border-ocean-light/30" {...props} />
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-ocean-deep" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  img: ({ src, alt, ...props }: any) => {
    return (
      <div className="my-8 rounded-lg overflow-hidden">
        <img
          src={src}
          alt={alt || ''}
          className="w-full h-auto object-cover"
          loading="lazy"
          {...props}
        />
      </div>
    )
  },
}

const hasMDXComponents = (content: string): boolean => {
  const componentNames = [
    'JourneyMap',
    'DiveLog',
    'RideRoute',
    'CodeFromLocation',
    'JourneyStats',
    'LocationCard',
    'StoryTimeline',
    'TimelineEvent',
  ]
  return componentNames.some((name) => content.includes(`<${name}`))
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const [mdxComponent, setMdxComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hasMDXComponents(content)) {
      const evaluateOptions = {
        ...runtime,
        development: false,
        baseUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      }
      
      Object.assign(evaluateOptions, mdxComponents)
      
      evaluate(content, evaluateOptions)
        .then(({ default: Component }) => {
          setMdxComponent(() => Component)
        })
        .catch((err) => {
          console.error('MDX compilation error:', err)
          setError(err.message || 'Failed to render MDX content. Check for undefined variables in your blog post.')
        })
    }
  }, [content])

  if (hasMDXComponents(content)) {
    if (error) {
      return (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          <p>Error rendering MDX content: {error}</p>
          <details className="mt-2">
            <summary className="cursor-pointer">Show fallback markdown</summary>
            <div className="mt-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          </details>
        </div>
      )
    }

    if (!mdxComponent) {
      return (
        <div className="text-ocean-base p-4 bg-ocean-pale/10 rounded-lg">
          Loading content...
        </div>
      )
    }

    const Component = mdxComponent as React.ComponentType<{ components?: any }>
    return <Component components={mdxComponents} />
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="font-serif text-4xl md:text-5xl text-ocean-deep mb-6 mt-10 heading-serif" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="font-serif text-3xl md:text-4xl text-ocean-deep mb-4 mt-8 heading-serif" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="font-serif text-2xl md:text-3xl text-ocean-deep mb-3 mt-6 heading-serif" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="text-ocean-base mb-6 leading-relaxed text-lg" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-outside text-ocean-base mb-6 space-y-3 ml-6" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-outside text-ocean-base mb-6 space-y-3 ml-6" {...props} />
        ),
        li: ({ node, ...props }) => <li className="text-ocean-base leading-relaxed" {...props} />,
        code: ({ node, inline, ...props }: any) => {
          if (inline) {
            return (
              <code
                className="px-2 py-1 bg-ocean-pale/20 text-ocean-deep rounded text-sm font-mono"
                {...props}
              />
            )
          }
          return (
            <code
              className="block p-5 bg-ocean-deep text-ocean-pale rounded-lg overflow-x-auto text-sm font-mono mb-6 shadow-lg border border-ocean-dark"
              {...props}
            />
          )
        },
        pre: ({ node, ...props }) => (
          <pre className="mb-6 overflow-x-auto" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a className="text-teal-base hover:text-teal-dark underline transition-colors" {...props} />
        ),
        blockquote: ({ node, children, ...props }: any) => (
          <blockquote
            className="border-l-4 border-teal-base pl-6 pr-4 py-6 my-8 bg-gradient-to-r from-ocean-pale/20 via-ocean-pale/10 to-transparent rounded-r-lg shadow-sm backdrop-blur-sm"
            {...props}
          >
            <p className="m-0 italic text-ocean-deep text-lg leading-relaxed font-serif">{children}</p>
          </blockquote>
        ),
        hr: ({ node, ...props }) => (
          <hr className="my-8 border-ocean-light/30" {...props} />
        ),
        img: ({ node, ...props }: any) => (
          <div className="my-8 rounded-lg overflow-hidden">
            <img
              className="w-full h-auto object-cover"
              loading="lazy"
              {...props}
            />
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}


