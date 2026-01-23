'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LifeMoment } from '@/types'
import { MarkdownContent } from '@/components/MarkdownContent'

export default function EditLifePage() {
  const router = useRouter()
  const [moments, setMoments] = useState<LifeMoment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content/life')
      const data = await response.json()
      if (data.moments) {
        setMoments(data.moments)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/content/life', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moments }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Life moments updated successfully!')
        router.push('/admin')
      } else {
        alert(data.message || 'Failed to save')
      }
    } catch (error) {
      alert('Error saving content')
    } finally {
      setSaving(false)
    }
  }

  const addMoment = () => {
    setMoments([
      ...moments,
      {
        id: `life-${Date.now()}`,
        type: 'travel',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
      },
    ])
  }

  const removeMoment = (index: number) => {
    setMoments(moments.filter((_, i) => i !== index))
  }

  const updateMoment = (index: number, field: keyof LifeMoment, value: any) => {
    const updated = [...moments]
    updated[index] = { ...updated[index], [field]: value }
    setMoments(updated)
  }

  const insertDiveLog = (index: number) => {
    const template = `\n\n<DiveLog 
  site="Dive Site Name"
  location="Location"
  depth={18}
  visibility={25}
  temperature={28}
  duration="45 min"
  highlights={["Marine life 1", "Marine life 2"]}
  date="2024-01-01"
/>\n\n`
    const current = moments[index].description
    updateMoment(index, 'description', current + template)
  }

  const insertTripDetails = (index: number) => {
    const template = `\n\n<TripDetails 
  duration="Dec 24 - Jan 1"
  route="Place A → Place B → Place C"
  stay="Hotel/Hostel Name (₹600/night)"
  weather="Weather conditions"
  cost="~₹8000 (breakdown)"
  companions="Number of people"
/>\n\n`
    const current = moments[index].description
    updateMoment(index, 'description', current + template)
  }

  const insertBlockquote = (index: number) => {
    const template = `\n\n> Your inspiring quote or key insight here.\n\n`
    const current = moments[index].description
    updateMoment(index, 'description', current + template)
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-4xl text-ocean-deep mb-2">Edit Life Moments</h1>
            <p className="text-ocean-base">Manage scuba dives, bike rides, travel moments, and reflections</p>
          </div>
          <button
            onClick={addMoment}
            className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
          >
            Add Moment
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {moments.map((moment, index) => (
            <div key={moment.id} className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-2xl text-ocean-deep">Moment #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeMoment(index)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Type *</label>
                  <select
                    value={moment.type}
                    onChange={(e) => updateMoment(index, 'type', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                    required
                  >
                    <option value="scuba">Scuba Dive</option>
                    <option value="motorcycle">Motorcycle Ride</option>
                    <option value="travel">Travel</option>
                    <option value="reflection">Reflection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Date *</label>
                  <input
                    type="date"
                    value={moment.date}
                    onChange={(e) => updateMoment(index, 'date', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Title *</label>
                <input
                  type="text"
                  value={moment.title}
                  onChange={(e) => updateMoment(index, 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-ocean-deep">Description * (Markdown/MDX supported)</label>
                  <button
                    type="button"
                    onClick={() => setPreviewIndex(previewIndex === index ? null : index)}
                    className="px-3 py-1 bg-ocean-light text-white rounded text-sm hover:bg-ocean-dark transition-colors"
                  >
                    {previewIndex === index ? 'Edit' : 'Preview'}
                  </button>
                </div>
                
                {previewIndex === index ? (
                  <div className="w-full p-6 rounded-lg border-2 border-teal-base bg-neutral-white min-h-[400px] max-h-[600px] overflow-y-auto">
                    <MarkdownContent content={moment.description} />
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => insertDiveLog(index)}
                        className="px-3 py-1 bg-teal-base/10 text-teal-base rounded text-xs hover:bg-teal-base/20 transition-colors"
                        title="Insert DiveLog component"
                      >
                        + DiveLog
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTripDetails(index)}
                        className="px-3 py-1 bg-teal-base/10 text-teal-base rounded text-xs hover:bg-teal-base/20 transition-colors"
                        title="Insert TripDetails component"
                      >
                        + TripDetails
                      </button>
                      <button
                        type="button"
                        onClick={() => insertBlockquote(index)}
                        className="px-3 py-1 bg-teal-base/10 text-teal-base rounded text-xs hover:bg-teal-base/20 transition-colors"
                        title="Insert blockquote"
                      >
                        + Quote
                      </button>
                    </div>
                    <textarea
                      value={moment.description}
                      onChange={(e) => updateMoment(index, 'description', e.target.value)}
                      rows={20}
                      className="w-full px-4 py-3 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base font-mono text-sm"
                      required
                      placeholder="Write your story here... Use Markdown for formatting.

**Bold text**, *italic text*

## Headers

- Bullet points
- More items

> Blockquotes for key insights

<DiveLog /> and <TripDetails /> components available via buttons above"
                    />
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Location</label>
                <input
                  type="text"
                  value={moment.location || ''}
                  onChange={(e) => updateMoment(index, 'location', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={moment.image || ''}
                  onChange={(e) => updateMoment(index, 'image', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
                <p className="text-xs text-ocean-light mt-1">URL to an image for this moment</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">YouTube Video URL (optional)</label>
                <input
                  type="url"
                  value={moment.videoUrl || ''}
                  onChange={(e) => updateMoment(index, 'videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
                <p className="text-xs text-ocean-light mt-1">YouTube video URL to embed for this moment</p>
              </div>
            </div>
          ))}

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

