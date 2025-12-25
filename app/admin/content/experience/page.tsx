'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorkExperience } from '@/types'

export default function EditExperiencePage() {
  const router = useRouter()
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content/experience')
      const data = await response.json()
      if (data.experiences) {
        setExperiences(data.experiences)
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
      const response = await fetch('/api/admin/content/experience', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiences }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Experience updated successfully!')
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

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: '',
        role: '',
        period: '',
        location: '',
        impact: [''],
        technologies: [''],
        metrics: [''],
      },
    ])
  }

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...experiences]
    updated[index] = { ...updated[index], [field]: value }
    setExperiences(updated)
  }

  const updateArrayField = (
    index: number,
    field: 'impact' | 'technologies' | 'metrics',
    arrayIndex: number,
    value: string
  ) => {
    const updated = [...experiences]
    const currentArray = field === 'metrics' 
      ? (updated[index][field] || [])
      : updated[index][field]
    const array = [...currentArray]
    array[arrayIndex] = value
    updated[index] = { ...updated[index], [field]: array }
    setExperiences(updated)
  }

  const addArrayItem = (index: number, field: 'impact' | 'technologies' | 'metrics') => {
    const updated = [...experiences]
    const currentArray = field === 'metrics'
      ? (updated[index][field] || [])
      : updated[index][field]
    updated[index] = { ...updated[index], [field]: [...currentArray, ''] }
    setExperiences(updated)
  }

  const removeArrayItem = (
    index: number,
    field: 'impact' | 'technologies' | 'metrics',
    arrayIndex: number
  ) => {
    const updated = [...experiences]
    const currentArray = field === 'metrics'
      ? (updated[index][field] || [])
      : updated[index][field]
    updated[index] = { ...updated[index], [field]: currentArray.filter((_, i) => i !== arrayIndex) }
    setExperiences(updated)
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
            <h1 className="font-serif text-4xl text-ocean-deep mb-2">Edit Experience</h1>
            <p className="text-ocean-base">Manage your work experience entries</p>
          </div>
          <button
            onClick={addExperience}
            className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
          >
            Add Experience
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-2xl text-ocean-deep">Experience #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Company *</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Role *</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => updateExperience(index, 'role', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Period *</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => updateExperience(index, 'period', e.target.value)}
                    placeholder="2022 - Present"
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ocean-deep mb-2">Location</label>
                  <input
                    type="text"
                    value={exp.location || ''}
                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-ocean-deep">Impact Points *</label>
                  <button
                    type="button"
                    onClick={() => addArrayItem(index, 'impact')}
                    className="text-sm text-teal-base hover:text-teal-dark"
                  >
                    + Add
                  </button>
                </div>
                {exp.impact.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateArrayField(index, 'impact', itemIndex, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'impact', itemIndex)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-ocean-deep">Technologies *</label>
                  <button
                    type="button"
                    onClick={() => addArrayItem(index, 'technologies')}
                    className="text-sm text-teal-base hover:text-teal-dark"
                  >
                    + Add
                  </button>
                </div>
                {exp.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => updateArrayField(index, 'technologies', techIndex, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'technologies', techIndex)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-ocean-deep">Metrics (Optional)</label>
                  <button
                    type="button"
                    onClick={() => addArrayItem(index, 'metrics')}
                    className="text-sm text-teal-base hover:text-teal-dark"
                  >
                    + Add
                  </button>
                </div>
                {(exp.metrics || []).map((metric, metricIndex) => (
                  <div key={metricIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={metric}
                      onChange={(e) => updateArrayField(index, 'metrics', metricIndex, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'metrics', metricIndex)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving || experiences.length === 0}
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

