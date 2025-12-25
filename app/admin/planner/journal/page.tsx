'use client'

import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { JournalEntry } from '@/types'

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/admin/planner/journal')
      const data = await response.json()
      setEntries(data.entries || [])
    } catch (error) {
      console.error('Error fetching journal entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewEntry = () => {
    setSelectedEntry(null)
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
    setShowEditor(true)
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setSelectedDate(entry.date)
    setShowEditor(true)
  }

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) return

    try {
      const response = await fetch(`/api/admin/planner/journal/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEntries()
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Failed to delete entry')
    }
  }

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    excited: '🤩',
    anxious: '😰',
    calm: '😌',
    frustrated: '😤',
    grateful: '🙏',
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin/planner"
              className="text-teal-base hover:text-teal-dark mb-2 inline-block"
            >
              ← Back to Planner
            </Link>
            <h1 className="font-serif text-4xl text-ocean-deep">Journal</h1>
          </div>
          <button
            onClick={handleNewEntry}
            className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
          >
            + New Entry
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="bg-neutral-white rounded-xl p-12 text-center shadow-lg">
            <p className="text-ocean-base mb-4">No journal entries yet</p>
            <button
              onClick={handleNewEntry}
              className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
            >
              Write Your First Entry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-neutral-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-ocean-deep mb-1">
                      {entry.title || format(parseISO(entry.date), 'MMMM d, yyyy')}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-ocean-light">
                      <span>{format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}</span>
                      {entry.mood && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            {moodEmojis[entry.mood]} {entry.mood}
                          </span>
                        </>
                      )}
                      {entry.weather && (
                        <>
                          <span>•</span>
                          <span>☀️ {entry.weather}</span>
                        </>
                      )}
                      {entry.location && (
                        <>
                          <span>•</span>
                          <span>📍 {entry.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="px-4 py-2 bg-ocean-pale/20 text-ocean-base rounded-lg text-sm font-medium hover:bg-teal-light/20 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="text-ocean-base whitespace-pre-wrap line-clamp-4">{entry.content}</p>
                </div>
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-ocean-pale/20 text-ocean-base rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showEditor && (
          <JournalEditor
            entry={selectedEntry}
            date={selectedDate}
            onClose={() => {
              setShowEditor(false)
              setSelectedEntry(null)
            }}
            onSave={() => {
              fetchEntries()
              setShowEditor(false)
              setSelectedEntry(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

function JournalEditor({
  entry,
  date,
  onClose,
  onSave,
}: {
  entry?: JournalEntry | null
  date: string
  onClose: () => void
  onSave: () => void
}) {
  const [title, setTitle] = useState(entry?.title || '')
  const [content, setContent] = useState(entry?.content || '')
  const [mood, setMood] = useState<JournalEntry['mood']>(entry?.mood)
  const [weather, setWeather] = useState(entry?.weather || '')
  const [location, setLocation] = useState(entry?.location || '')
  const [tags, setTags] = useState(entry?.tags.join(', ') || '')
  const [saving, setSaving] = useState(false)

  const moods: Array<{ value: JournalEntry['mood']; label: string; emoji: string }> = [
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'excited', label: 'Excited', emoji: '🤩' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' },
    { value: 'calm', label: 'Calm', emoji: '😌' },
    { value: 'frustrated', label: 'Frustrated', emoji: '😤' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const entryData = {
        date,
        title: title || undefined,
        content,
        mood,
        weather: weather || undefined,
        location: location || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      }

      const url = entry ? `/api/admin/planner/journal/${entry.id}` : '/api/admin/planner/journal'
      const method = entry ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      })

      const data = await response.json()

      if (data.success) {
        onSave()
      } else {
        alert(data.message || 'Failed to save entry')
      }
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Failed to save entry')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl text-ocean-deep">
            {entry ? 'Edit Entry' : 'New Journal Entry'}
          </h2>
          <button
            onClick={onClose}
            className="text-ocean-light hover:text-ocean-deep transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {}}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-ocean-pale/10 text-ocean-deep"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Write your thoughts..."
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base font-mono"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Mood</label>
              <select
                value={mood || ''}
                onChange={(e) => setMood(e.target.value as JournalEntry['mood'] || undefined)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              >
                <option value="">Select mood...</option>
                {moods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.emoji} {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Weather</label>
              <input
                type="text"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="Sunny, Rainy..."
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you?"
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="travel, reflection, work..."
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : entry ? 'Update Entry' : 'Save Entry'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


