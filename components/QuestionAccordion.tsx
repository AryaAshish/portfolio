'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PrepQuestion } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface QuestionAccordionProps {
  question: PrepQuestion
}

const questionDifficultyColors: Record<PrepQuestion['difficulty'], string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
}

function getShortAnswer(fullAnswer: string): string {
  if (!fullAnswer) return ''
  
  const sentences = fullAnswer.split(/[.!?]\s+/)
  if (sentences.length <= 2) {
    return fullAnswer
  }
  
  return sentences.slice(0, 2).join('. ') + '.'
}

function isDeepTopic(question: PrepQuestion): boolean {
  if (!question.answer) return false
  
  const answerLength = question.answer.length
  const hasCodeBlocks = question.answer.includes('```') || question.answer.includes('`')
  const hasMultipleParagraphs = question.answer.split('\n\n').length > 2
  
  return answerLength > 500 || hasCodeBlocks || hasMultipleParagraphs
}

export function QuestionAccordion({ question }: QuestionAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shortAnswer = question.answer ? getShortAnswer(question.answer) : ''
  const isDeep = isDeepTopic(question)
  const showReadMore = isDeep && question.answer && question.answer.length > shortAnswer.length

  return (
    <div className="bg-ocean-pale/5 rounded-lg border border-ocean-light/10 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-start justify-between gap-4 hover:bg-ocean-pale/10 transition-colors text-left"
      >
        <p className="text-ocean-deep font-medium flex-1">{question.question}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${questionDifficultyColors[question.difficulty]}`}
          >
            {question.difficulty}
          </span>
          <motion.svg
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5 text-ocean-base flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && question.answer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-ocean-light/20">
              <div className="prose prose-sm max-w-none">
                {showReadMore ? (
                  <>
                    <div className="text-ocean-base mb-3">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children, ...props }) => (
                            <p className="mb-3 text-ocean-base leading-relaxed" {...props}>
                              {children}
                            </p>
                          ),
                          strong: ({ children, ...props }) => (
                            <strong className="font-semibold text-ocean-deep" {...props}>
                              {children}
                            </strong>
                          ),
                          em: ({ children, ...props }) => (
                            <em className="italic" {...props}>
                              {children}
                            </em>
                          ),
                          code: ({ inline, children, ...props }: any) => {
                            if (inline) {
                              return (
                                <code
                                  className="px-1.5 py-0.5 bg-ocean-pale/20 text-ocean-deep rounded text-sm font-mono"
                                  {...props}
                                >
                                  {children}
                                </code>
                              )
                            }
                            return (
                              <code
                                className="block p-3 bg-ocean-deep text-ocean-pale rounded-lg overflow-x-auto text-xs font-mono mb-3"
                                {...props}
                              >
                                {children}
                              </code>
                            )
                          },
                          ul: ({ children, ...props }) => (
                            <ul className="list-disc list-inside text-ocean-base mb-3 space-y-1 ml-2" {...props}>
                              {children}
                            </ul>
                          ),
                          ol: ({ children, ...props }) => (
                            <ol className="list-decimal list-inside text-ocean-base mb-3 space-y-1 ml-2" {...props}>
                              {children}
                            </ol>
                          ),
                          li: ({ children, ...props }) => (
                            <li className="text-ocean-base leading-relaxed" {...props}>
                              {children}
                            </li>
                          ),
                        }}
                      >
                        {shortAnswer}
                      </ReactMarkdown>
                    </div>
                    {question.relatedBlogPost ? (
                      <Link
                        href={`/blog/${question.relatedBlogPost}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-teal-base hover:text-teal-dark text-sm font-medium transition-colors underline"
                      >
                        Read more
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <div className="text-ocean-base">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children, ...props }) => (
                          <p className="mb-3 text-ocean-base leading-relaxed" {...props}>
                            {children}
                          </p>
                        ),
                        strong: ({ children, ...props }) => (
                          <strong className="font-semibold text-ocean-deep" {...props}>
                            {children}
                          </strong>
                        ),
                        em: ({ children, ...props }) => (
                          <em className="italic" {...props}>
                            {children}
                          </em>
                        ),
                        code: ({ inline, children, ...props }: any) => {
                          if (inline) {
                            return (
                              <code
                                className="px-1.5 py-0.5 bg-ocean-pale/20 text-ocean-deep rounded text-sm font-mono"
                                {...props}
                              >
                                {children}
                              </code>
                            )
                          }
                          return (
                            <code
                              className="block p-3 bg-ocean-deep text-ocean-pale rounded-lg overflow-x-auto text-xs font-mono mb-3"
                              {...props}
                            >
                              {children}
                            </code>
                          )
                        },
                        pre: ({ children, ...props }) => (
                          <pre className="mb-3 overflow-x-auto" {...props}>
                            {children}
                          </pre>
                        ),
                        ul: ({ children, ...props }) => (
                          <ul className="list-disc list-inside text-ocean-base mb-3 space-y-1 ml-2" {...props}>
                            {children}
                          </ul>
                        ),
                        ol: ({ children, ...props }) => (
                          <ol className="list-decimal list-inside text-ocean-base mb-3 space-y-1 ml-2" {...props}>
                            {children}
                          </ol>
                        ),
                        li: ({ children, ...props }) => (
                          <li className="text-ocean-base leading-relaxed" {...props}>
                            {children}
                          </li>
                        ),
                        h1: ({ children, ...props }) => (
                          <h1 className="font-serif text-xl text-ocean-deep mb-2 mt-3" {...props}>
                            {children}
                          </h1>
                        ),
                        h2: ({ children, ...props }) => (
                          <h2 className="font-serif text-lg text-ocean-deep mb-2 mt-3" {...props}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children, ...props }) => (
                          <h3 className="font-semibold text-base text-ocean-deep mb-2 mt-3" {...props}>
                            {children}
                          </h3>
                        ),
                      }}
                    >
                      {question.answer}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-ocean-light/10">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-ocean-pale/20 text-ocean-base text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

