'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AboutTimelineEvent } from '@/lib/content'

export default function EditAboutPage() {
  const router = useRouter()
  const [timeline, setTimeline] = useState<AboutTimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTimeline()
  }, [])

  const fetchTimeline = async () => {
    try {
      const response = await fetch('/api/admin/content/about')
      const data = await response.json()
      if (data.timeline) {
        setTimeline(data.timeline)
      }
    } catch (error) {
      console.error('Failed to fetch timeline:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/content/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline }),
      })

      const data = await response.json()
      if (data.success) {
        alert('About timeline updated successfully!')
        router.push('/admin')
      } else {
        alert(data.message || 'Failed to save')
      }
    } catch (error) {
      alert('Error saving timeline')
    } finally {
      setSaving(false)
    }
  }

  const updateEvent = (index: number, field: keyof AboutTimelineEvent, value: string) => {
    const updated = [...timeline]
    updated[index] = { ...updated[index], [field]: value }
    setTimeline(updated)
  }

  const addEvent = () => {
    setTimeline([
      ...timeline,
      {
        year: '',
        title: '',
        description: '',
        type: 'milestone',
      },
    ])
  }

  const removeEvent = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index))
  }

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    const updated = [...timeline]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < updated.length) {
      ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
      setTimeline(updated)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-off flex items-center justify-center">
        <p className="text-ocean-base">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-ocean-deep mb-2">Edit About Timeline</h1>
          <p className="text-ocean-base">Edit your personal journey timeline events</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {timeline.map((event, index) => (
            <div key={index} className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-xl text-ocean-deep">Event {index + 1}</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveEvent(index, 'up')}
                    disabled={index === 0}
                    className="px-3 py-1 bg-ocean-light text-ocean-deep rounded text-sm hover:bg-ocean-base disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveEvent(index, 'down')}
                    disabled={index === timeline.length - 1}
                    className="px-3 py-1 bg-ocean-light text-ocean-deep rounded text-sm hover:bg-ocean-base disabled:opacity-50"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEvent(index)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Year</label>
                  <input
                    type="text"
                    value={event.year}
                    onChange={(e) => updateEvent(index, 'year', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Type</label>
                  <select
                    value={event.type || 'milestone'}
                    onChange={(e) => updateEvent(index, 'type', e.target.value as AboutTimelineEvent['type'])}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  >
                    <option value="career">Career</option>
                    <option value="personal">Personal</option>
                    <option value="milestone">Milestone</option>
                    <option value="philosophy">Philosophy</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-ocean-deep mb-2">Title</label>
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => updateEvent(index, 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-ocean-deep mb-2">Description</label>
                <textarea
                  value={event.description}
                  onChange={(e) => updateEvent(index, 'description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Icon (emoji, optional)</label>
                <input
                  type="text"
                  value={event.icon || ''}
                  onChange={(e) => updateEvent(index, 'icon', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  placeholder="🎓"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEvent}
            className="w-full px-6 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors border-2 border-dashed border-ocean-base"
          >
            + Add New Event
          </button>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <a
              href="/admin"
              className="px-8 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

