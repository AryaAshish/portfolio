'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIBlogAssistantProps {
  title: string
  description: string
  content: string
  onOutlineGenerated?: (outline: string) => void
  onWritingImproved?: (improved: string) => void
  onSEOOptimized?: (data: { suggestions: string[]; metaDescription: string; keywords: string[] }) => void
  onMetaGenerated?: (meta: string) => void
  onCodeExplained?: (explanation: string) => void
  onTopicsSuggested?: (topics: string[]) => void
}

export function AIBlogAssistant({
  title,
  description,
  content,
  onOutlineGenerated,
  onWritingImproved,
  onSEOOptimized,
  onMetaGenerated,
  onCodeExplained,
  onTopicsSuggested,
}: AIBlogAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [topicInput, setTopicInput] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [codeLanguage, setCodeLanguage] = useState('')
  const [improveFocus, setImproveFocus] = useState('')

  const handleGenerateOutline = async () => {
    if (!topicInput.trim()) {
      setError('Please enter a topic')
      return
    }

    setLoading('outline')
    setError(null)

    try {
      const response = await fetch('/api/ai/blog/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicInput }),
      })

      const data = await response.json()
      if (data.success) {
        onOutlineGenerated?.(data.outline)
        setTopicInput('')
        setIsOpen(false)
      } else {
        setError(data.message || 'Failed to generate outline')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleImproveWriting = async () => {
    if (!content.trim()) {
      setError('Please add some content first')
      return
    }

    setLoading('improve')
    setError(null)

    try {
      const response = await fetch('/api/ai/blog/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, focus: improveFocus || undefined }),
      })

      const data = await response.json()
      if (data.success) {
        onWritingImproved?.(data.improved)
        setImproveFocus('')
        setIsOpen(false)
      } else {
        setError(data.message || 'Failed to improve writing')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleOptimizeSEO = async () => {
    if (!title || !content) {
      setError('Title and content are required')
      return
    }

    setLoading('seo')
    setError(null)

    try {
      const response = await fetch('/api/ai/blog/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      const data = await response.json()
      if (data.success) {
        onSEOOptimized?.(data)
        setIsOpen(false)
      } else {
        setError(data.message || 'Failed to optimize SEO')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleGenerateMeta = async () => {
    if (!title || !content) {
      setError('Title and content are required')
      return
    }

    setLoading('meta')
    setError(null)

    try {
      const response = await fetch('/api/ai/blog/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      const data = await response.json()
      if (data.success) {
        onMetaGenerated?.(data.metaDescription)
        setIsOpen(false)
      } else {
        setError(data.message || 'Failed to generate meta description')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleExplainCode = async () => {
    if (!codeInput.trim()) {
      setError('Please enter code to explain')
      return
    }

    setLoading('explain')
    setError(null)

    try {
      const response = await fetch('/api/ai/blog/explain-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput, language: codeLanguage || undefined }),
      })

      const data = await response.json()
      if (data.success) {
        onCodeExplained?.(data.explanation)
        setCodeInput('')
        setCodeLanguage('')
        setIsOpen(false)
      } else {
        setError(data.message || 'Failed to explain code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleSuggestTopics = async () => {
    if (!title || !content) {
      setError('Title and content are required')
      return
    }

    setLoading('topics')
    setError(null)

    try {
      const response = await fetch('/api/ai/blog/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, existingTopics: [] }),
      })

      const data = await response.json()
      if (data.success) {
        onTopicsSuggested?.(data.topics)
        setIsOpen(false)
      } else {
        setError(data.message || 'Failed to suggest topics')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-teal-base to-teal-dark text-neutral-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        AI Assistant
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-8 right-8 w-96 max-h-[80vh] bg-neutral-white rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="bg-gradient-to-r from-teal-base to-teal-dark text-neutral-white p-4 flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold">AI Writing Assistant</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-white hover:text-ocean-pale transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Generate Outline */}
                <div className="border border-ocean-light rounded-lg p-4">
                  <h4 className="font-semibold text-ocean-deep mb-2 flex items-center gap-2">
                    <span>📝</span> Generate Blog Outline
                  </h4>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="Enter blog topic..."
                    className="w-full px-3 py-2 rounded border border-ocean-light mb-2 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerateOutline()}
                  />
                  <button
                    onClick={handleGenerateOutline}
                    disabled={loading === 'outline'}
                    className="w-full px-4 py-2 bg-teal-base text-white rounded hover:bg-teal-dark transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading === 'outline' ? 'Generating...' : 'Generate'}
                  </button>
                </div>

                {/* Improve Writing */}
                <div className="border border-ocean-light rounded-lg p-4">
                  <h4 className="font-semibold text-ocean-deep mb-2 flex items-center gap-2">
                    <span>✨</span> Improve Writing
                  </h4>
                  <input
                    type="text"
                    value={improveFocus}
                    onChange={(e) => setImproveFocus(e.target.value)}
                    placeholder="Focus area (optional)..."
                    className="w-full px-3 py-2 rounded border border-ocean-light mb-2 text-sm"
                  />
                  <button
                    onClick={handleImproveWriting}
                    disabled={loading === 'improve'}
                    className="w-full px-4 py-2 bg-teal-base text-white rounded hover:bg-teal-dark transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading === 'improve' ? 'Improving...' : 'Improve Content'}
                  </button>
                </div>

                {/* SEO Optimization */}
                <div className="border border-ocean-light rounded-lg p-4">
                  <h4 className="font-semibold text-ocean-deep mb-2 flex items-center gap-2">
                    <span>🔍</span> SEO Optimization
                  </h4>
                  <button
                    onClick={handleOptimizeSEO}
                    disabled={loading === 'seo'}
                    className="w-full px-4 py-2 bg-teal-base text-white rounded hover:bg-teal-dark transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading === 'seo' ? 'Optimizing...' : 'Optimize SEO'}
                  </button>
                </div>

                {/* Generate Meta Description */}
                <div className="border border-ocean-light rounded-lg p-4">
                  <h4 className="font-semibold text-ocean-deep mb-2 flex items-center gap-2">
                    <span>📄</span> Meta Description
                  </h4>
                  <button
                    onClick={handleGenerateMeta}
                    disabled={loading === 'meta'}
                    className="w-full px-4 py-2 bg-teal-base text-white rounded hover:bg-teal-dark transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading === 'meta' ? 'Generating...' : 'Generate Meta'}
                  </button>
                </div>

                {/* Explain Code */}
                <div className="border border-ocean-light rounded-lg p-4">
                  <h4 className="font-semibold text-ocean-deep mb-2 flex items-center gap-2">
                    <span>💻</span> Explain Code
                  </h4>
                  <input
                    type="text"
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    placeholder="Language (optional)..."
                    className="w-full px-3 py-2 rounded border border-ocean-light mb-2 text-sm"
                  />
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Paste code snippet..."
                    rows={4}
                    className="w-full px-3 py-2 rounded border border-ocean-light mb-2 text-sm font-mono"
                  />
                  <button
                    onClick={handleExplainCode}
                    disabled={loading === 'explain'}
                    className="w-full px-4 py-2 bg-teal-base text-white rounded hover:bg-teal-dark transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading === 'explain' ? 'Explaining...' : 'Explain Code'}
                  </button>
                </div>

                {/* Suggest Topics */}
                <div className="border border-ocean-light rounded-lg p-4">
                  <h4 className="font-semibold text-ocean-deep mb-2 flex items-center gap-2">
                    <span>💡</span> Related Topics
                  </h4>
                  <button
                    onClick={handleSuggestTopics}
                    disabled={loading === 'topics'}
                    className="w-full px-4 py-2 bg-teal-base text-white rounded hover:bg-teal-dark transition-colors disabled:opacity-50 text-sm"
                  >
                    {loading === 'topics' ? 'Suggesting...' : 'Suggest Topics'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}


