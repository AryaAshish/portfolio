'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PrepPath, PrepTopic, PrepQuestion, PrepResource } from '@/types'

const categories: PrepPath['category'][] = ['android', 'system-design', 'dsa', 'frontend', 'backend', 'devops', 'other']
const difficulties: PrepPath['difficulty'][] = ['beginner', 'intermediate', 'advanced']
const questionDifficulties: PrepQuestion['difficulty'][] = ['easy', 'medium', 'hard']
const resourceTypes: PrepResource['type'][] = ['blog', 'video', 'documentation', 'book', 'course', 'practice']

export default function EditPrepPathPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [path, setPath] = useState<PrepPath | null>(null)
  const [topics, setTopics] = useState<(PrepTopic & { questions: PrepQuestion[]; resources: PrepResource[] })[]>([])
  const [pathResources, setPathResources] = useState<PrepResource[]>([])

  useEffect(() => {
    fetchPath()
  }, [params.id])

  const fetchPath = async () => {
    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setPath(data.path)
        setTopics(data.path.topics || [])
        setPathResources(data.path.resources || [])
      }
    } catch (error) {
      console.error('Failed to fetch prep path:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePath = async () => {
    if (!path) return
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(path),
      })

      const data = await response.json()
      if (data.success) {
        alert('Prep path updated successfully!')
      } else {
        alert(data.message || 'Failed to update')
      }
    } catch (error) {
      alert('Error updating prep path')
    } finally {
      setSaving(false)
    }
  }

  const handleAddTopic = async () => {
    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prepPathId: params.id,
          title: 'New Topic',
          description: '',
          order: topics.length,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setTopics([...topics, { ...data.topic, questions: [], resources: [] }])
      }
    } catch (error) {
      alert('Error creating topic')
    }
  }

  const handleUpdateTopic = async (topicId: string, updates: Partial<PrepTopic>) => {
    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}/topics/${topicId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()
      if (data.success) {
        setTopics(topics.map(t => t.id === topicId ? { ...t, ...data.topic } : t))
      }
    } catch (error) {
      alert('Error updating topic')
    }
  }

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Delete this topic and all its questions and resources?')) return

    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}/topics/${topicId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTopics(topics.filter(t => t.id !== topicId))
      }
    } catch (error) {
      alert('Error deleting topic')
    }
  }

  const handleAddQuestion = async (topicId: string) => {
    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}/topics/${topicId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prepTopicId: topicId,
          question: 'New Question',
          answer: '',
          difficulty: 'medium',
          tags: [],
          order: topics.find(t => t.id === topicId)?.questions.length || 0,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setTopics(topics.map(t =>
          t.id === topicId
            ? { ...t, questions: [...t.questions, data.question] }
            : t
        ))
      }
    } catch (error) {
      alert('Error creating question')
    }
  }

  const handleUpdateQuestion = async (topicId: string, questionId: string, updates: Partial<PrepQuestion>) => {
    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}/topics/${topicId}/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()
      if (data.success) {
        setTopics(topics.map(t =>
          t.id === topicId
            ? { ...t, questions: t.questions.map(q => q.id === questionId ? data.question : q) }
            : t
        ))
      }
    } catch (error) {
      alert('Error updating question')
    }
  }

  const handleDeleteQuestion = async (topicId: string, questionId: string) => {
    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}/topics/${topicId}/questions/${questionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTopics(topics.map(t =>
          t.id === topicId
            ? { ...t, questions: t.questions.filter(q => q.id !== questionId) }
            : t
        ))
      }
    } catch (error) {
      alert('Error deleting question')
    }
  }

  const handleAddResource = async (topicId?: string) => {
    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prepPathId: topicId ? undefined : params.id,
          prepTopicId: topicId || undefined,
          title: 'New Resource',
          type: 'blog',
          url: '',
          description: '',
          order: topicId
            ? topics.find(t => t.id === topicId)?.resources.length || 0
            : pathResources.length,
        }),
      })

      const data = await response.json()
      if (data.success) {
        if (topicId) {
          setTopics(topics.map(t =>
            t.id === topicId
              ? { ...t, resources: [...t.resources, data.resource] }
              : t
          ))
        } else {
          setPathResources([...pathResources, data.resource])
        }
      }
    } catch (error) {
      alert('Error creating resource')
    }
  }

  const handleUpdateResource = async (resourceId: string, updates: Partial<PrepResource>, topicId?: string) => {
    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}/resources/${resourceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()
      if (data.success) {
        if (topicId) {
          setTopics(topics.map(t =>
            t.id === topicId
              ? { ...t, resources: t.resources.map(r => r.id === resourceId ? data.resource : r) }
              : t
          ))
        } else {
          setPathResources(pathResources.map(r => r.id === resourceId ? data.resource : r))
        }
      }
    } catch (error) {
      alert('Error updating resource')
    }
  }

  const handleDeleteResource = async (resourceId: string, topicId?: string) => {
    try {
      const response = await fetch(`/api/admin/prep-paths/${params.id}/resources/${resourceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        if (topicId) {
          setTopics(topics.map(t =>
            t.id === topicId
              ? { ...t, resources: t.resources.filter(r => r.id !== resourceId) }
              : t
          ))
        } else {
          setPathResources(pathResources.filter(r => r.id !== resourceId))
        }
      }
    } catch (error) {
      alert('Error deleting resource')
    }
  }

  if (loading || !path) {
    return (
      <div className="min-h-screen bg-neutral-off py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-ocean-base">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-ocean-deep mb-2">Edit Prep Path</h1>
            <p className="text-ocean-base">{path.title}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/prep-paths"
              className="px-6 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors"
            >
              Back
            </Link>
            <Link
              href={`/prep/${path.id}`}
              target="_blank"
              className="px-6 py-3 bg-teal-base/10 text-teal-base rounded-lg font-medium hover:bg-teal-base/20 transition-colors"
            >
              View Public
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-neutral-white rounded-xl p-6 md:p-8 shadow-lg">
            <h2 className="font-serif text-2xl text-ocean-deep mb-6">Path Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-ocean-deep mb-2">Title *</label>
                <input
                  type="text"
                  value={path.title}
                  onChange={(e) => setPath({ ...path, title: e.target.value })}
                  className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ocean-deep mb-2">Description *</label>
                <textarea
                  value={path.description}
                  onChange={(e) => setPath({ ...path, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ocean-deep mb-2">Category</label>
                  <select
                    value={path.category}
                    onChange={(e) => setPath({ ...path, category: e.target.value as PrepPath['category'] })}
                    className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ocean-deep mb-2">Difficulty</label>
                  <select
                    value={path.difficulty}
                    onChange={(e) => setPath({ ...path, difficulty: e.target.value as PrepPath['difficulty'] })}
                    className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ocean-deep mb-2">Color</label>
                  <input
                    type="color"
                    value={path.color}
                    onChange={(e) => setPath({ ...path, color: e.target.value })}
                    className="w-full h-10 border border-ocean-light/20 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={path.published}
                  onChange={(e) => setPath({ ...path, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-semibold text-ocean-deep">Published</label>
              </div>
              <button
                onClick={handleSavePath}
                disabled={saving}
                className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Path Details'}
              </button>
            </div>
          </div>

          <div className="bg-neutral-white rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-ocean-deep">General Resources</h2>
              <button
                onClick={() => handleAddResource()}
                className="px-4 py-2 bg-teal-base text-neutral-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-colors"
              >
                + Add Resource
              </button>
            </div>
            <div className="space-y-4">
              {pathResources.map((resource) => (
                <div key={resource.id} className="border border-ocean-light/20 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      value={resource.title}
                      onChange={(e) => handleUpdateResource(resource.id, { title: e.target.value })}
                      placeholder="Resource Title"
                      className="px-3 py-2 border border-ocean-light/20 rounded-lg text-sm"
                    />
                    <select
                      value={resource.type}
                      onChange={(e) => handleUpdateResource(resource.id, { type: e.target.value as PrepResource['type'] })}
                      className="px-3 py-2 border border-ocean-light/20 rounded-lg text-sm"
                    >
                      {resourceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="url"
                    value={resource.url}
                    onChange={(e) => handleUpdateResource(resource.id, { url: e.target.value })}
                    placeholder="URL"
                    className="w-full px-3 py-2 border border-ocean-light/20 rounded-lg text-sm mb-3"
                  />
                  <textarea
                    value={resource.description || ''}
                    onChange={(e) => handleUpdateResource(resource.id, { description: e.target.value })}
                    placeholder="Description (optional)"
                    rows={2}
                    className="w-full px-3 py-2 border border-ocean-light/20 rounded-lg text-sm mb-3"
                  />
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-white rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-ocean-deep">Topics</h2>
              <button
                onClick={handleAddTopic}
                className="px-4 py-2 bg-teal-base text-neutral-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-colors"
              >
                + Add Topic
              </button>
            </div>
            <div className="space-y-6">
              {topics.map((topic) => (
                <div key={topic.id} className="border border-ocean-light/20 rounded-lg p-6">
                  <div className="mb-4">
                    <input
                      type="text"
                      value={topic.title}
                      onChange={(e) => handleUpdateTopic(topic.id, { title: e.target.value })}
                      placeholder="Topic Title"
                      className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg mb-2 font-semibold text-ocean-deep"
                    />
                    <textarea
                      value={topic.description || ''}
                      onChange={(e) => handleUpdateTopic(topic.id, { description: e.target.value })}
                      placeholder="Topic Description (optional)"
                      rows={2}
                      className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-ocean-deep">Topic Resources</h3>
                      <button
                        onClick={() => handleAddResource(topic.id)}
                        className="px-3 py-1 bg-ocean-pale/20 text-ocean-base rounded text-sm hover:bg-ocean-pale/30 transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {topic.resources.map((resource) => (
                        <div key={resource.id} className="bg-ocean-pale/5 rounded p-3">
                          <div className="grid md:grid-cols-2 gap-2 mb-2">
                            <input
                              type="text"
                              value={resource.title}
                              onChange={(e) => handleUpdateResource(resource.id, { title: e.target.value }, topic.id)}
                              className="px-2 py-1 border border-ocean-light/20 rounded text-sm"
                            />
                            <select
                              value={resource.type}
                              onChange={(e) => handleUpdateResource(resource.id, { type: e.target.value as PrepResource['type'] }, topic.id)}
                              className="px-2 py-1 border border-ocean-light/20 rounded text-sm"
                            >
                              {resourceTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <input
                            type="url"
                            value={resource.url}
                            onChange={(e) => handleUpdateResource(resource.id, { url: e.target.value }, topic.id)}
                            className="w-full px-2 py-1 border border-ocean-light/20 rounded text-sm mb-2"
                          />
                          <button
                            onClick={() => handleDeleteResource(resource.id, topic.id)}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-ocean-deep">Interview Questions</h3>
                      <button
                        onClick={() => handleAddQuestion(topic.id)}
                        className="px-3 py-1 bg-ocean-pale/20 text-ocean-base rounded text-sm hover:bg-ocean-pale/30 transition-colors"
                      >
                        + Add Question
                      </button>
                    </div>
                    <div className="space-y-3">
                      {topic.questions.map((question) => (
                        <div key={question.id} className="bg-ocean-pale/5 rounded p-4 border border-ocean-light/10">
                          <textarea
                            value={question.question}
                            onChange={(e) => handleUpdateQuestion(topic.id, question.id, { question: e.target.value })}
                            placeholder="Question"
                            rows={2}
                            className="w-full px-3 py-2 border border-ocean-light/20 rounded-lg text-sm mb-2"
                          />
                          <textarea
                            value={question.answer || ''}
                            onChange={(e) => handleUpdateQuestion(topic.id, question.id, { answer: e.target.value })}
                            placeholder="Answer (optional)"
                            rows={4}
                            className="w-full px-3 py-2 border border-ocean-light/20 rounded-lg text-sm mb-2"
                          />
                          <div className="flex items-center gap-3 mb-2">
                            <select
                              value={question.difficulty}
                              onChange={(e) => handleUpdateQuestion(topic.id, question.id, { difficulty: e.target.value as PrepQuestion['difficulty'] })}
                              className="px-3 py-1 border border-ocean-light/20 rounded text-sm"
                            >
                              {questionDifficulties.map(diff => (
                                <option key={diff} value={diff}>{diff}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={question.tags.join(', ')}
                              onChange={(e) => handleUpdateQuestion(topic.id, question.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                              placeholder="Tags (comma separated)"
                              className="flex-1 px-3 py-1 border border-ocean-light/20 rounded text-sm"
                            />
                          </div>
                          <button
                            onClick={() => handleDeleteQuestion(topic.id, question.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                          >
                            Delete Question
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete Topic
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

