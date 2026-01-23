'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { LifeMoment } from '@/types'
import { MarkdownContent } from '@/components/MarkdownContent'

export default function EditLifeMomentPage() {
  const router = useRouter()
  const params = useParams()
  const momentId = params.id as string
  
  const [moment, setMoment] = useState<LifeMoment | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    fetchMoment()
  }, [momentId])

  const fetchMoment = async () => {
    try {
      const response = await fetch('/api/admin/content/life')
      const data = await response.json()
      if (data.moments) {
        const foundMoment = data.moments.find((m: LifeMoment) => m.id === momentId)
        if (foundMoment) {
          setMoment(foundMoment)
        }
      }
    } catch (error) {
      console.error('Failed to fetch moment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!moment) return
    
    setSaving(true)

    try {
      // Fetch all moments
      const response = await fetch('/api/admin/content/life')
      const data = await response.json()
      
      // Update the specific moment
      const updatedMoments = data.moments.map((m: LifeMoment) => 
        m.id === momentId ? moment : m
      )

      // Save back
      const saveResponse = await fetch('/api/admin/content/life', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moments: updatedMoments }),
      })

      const saveData = await saveResponse.json()
      if (saveData.success) {
        alert('Moment updated successfully!')
        router.push('/admin/life')
      } else {
        alert(saveData.message || 'Failed to save')
      }
    } catch (error) {
      alert('Error saving moment')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof LifeMoment, value: any) => {
    if (!moment) return
    setMoment({ ...moment, [field]: value })
  }

  const insertDiveLog = () => {
    if (!moment) return
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
    updateField('description', moment.description + template)
  }

  const insertTripDetails = () => {
    if (!moment) return
    const template = `\n\n<TripDetails 
  duration="Dec 24 - Jan 1"
  route="Place A → Place B → Place C"
  stay="Hotel/Hostel Name (₹600/night)"
  weather="Weather conditions"
  cost="~₹8000 (breakdown)"
  companions="Number of people"
/>\n\n`
    updateField('description', moment.description + template)
  }

  const insertBlockquote = () => {
    if (!moment) return
    const template = `\n\n> Your inspiring quote or key insight here.\n\n`
    updateField('description', moment.description + template)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-off flex items-center justify-center">
        <p className="text-ocean-base">Loading...</p>
      </div>
    )
  }

  if (!moment) {
    return (
      <div className="min-h-screen bg-neutral-off flex items-center justify-center">
        <div className="text-center">
          <p className="text-ocean-base mb-4">Moment not found</p>
          <a href="/admin/life" className="text-teal-base hover:underline">
            Back to Life Moments
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-ocean-deep mb-2">Edit Life Moment</h1>
          <p className="text-ocean-base">Update your story with Markdown and visual components</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Type *</label>
                <select
                  value={moment.type}
                  onChange={(e) => updateField('type', e.target.value)}
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
                  onChange={(e) => updateField('date', e.target.value)}
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
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-ocean-deep">Description * (Markdown/MDX supported)</label>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-3 py-1 bg-ocean-light text-white rounded text-sm hover:bg-ocean-dark transition-colors"
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
              </div>
              
              {previewMode ? (
                <div className="w-full p-6 rounded-lg border-2 border-teal-base bg-neutral-white min-h-[400px] max-h-[600px] overflow-y-auto">
                  <MarkdownContent content={moment.description} />
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={insertDiveLog}
                      className="px-3 py-1 bg-teal-base/10 text-teal-base rounded text-xs hover:bg-teal-base/20 transition-colors"
                      title="Insert DiveLog component"
                    >
                      + DiveLog
                    </button>
                    <button
                      type="button"
                      onClick={insertTripDetails}
                      className="px-3 py-1 bg-teal-base/10 text-teal-base rounded text-xs hover:bg-teal-base/20 transition-colors"
                      title="Insert TripDetails component"
                    >
                      + TripDetails
                    </button>
                    <button
                      type="button"
                      onClick={insertBlockquote}
                      className="px-3 py-1 bg-teal-base/10 text-teal-base rounded text-xs hover:bg-teal-base/20 transition-colors"
                      title="Insert blockquote"
                    >
                      + Quote
                    </button>
                  </div>
                  <textarea
                    value={moment.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={20}
                    className="w-full px-4 py-3 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base font-mono text-sm"
                    required
                    placeholder="Write your story here... Use Markdown for formatting."
                  />
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Location</label>
              <input
                type="text"
                value={moment.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Image URL (optional)</label>
              <input
                type="url"
                value={moment.image || ''}
                onChange={(e) => updateField('image', e.target.value)}
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
                onChange={(e) => updateField('videoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
              <p className="text-xs text-ocean-light mt-1">YouTube video URL to embed for this moment</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <a
              href="/admin/life"
              className="px-8 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors inline-block"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
