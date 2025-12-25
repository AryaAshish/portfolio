'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Skill } from '@/types'

export default function EditSkillsPage() {
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content/skills')
      const data = await response.json()
      if (data.skills) {
        setSkills(data.skills)
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
      const response = await fetch('/api/admin/content/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Skills updated successfully!')
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

  const addCategory = () => {
    setSkills([...skills, { category: '', items: [''] }])
  }

  const removeCategory = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const updateCategory = (index: number, field: 'category', value: string) => {
    const updated = [...skills]
    updated[index] = { ...updated[index], [field]: value }
    setSkills(updated)
  }

  const updateItem = (categoryIndex: number, itemIndex: number, value: string) => {
    const updated = [...skills]
    if (!updated[categoryIndex].items) {
      updated[categoryIndex].items = []
    }
    updated[categoryIndex].items![itemIndex] = value
    setSkills(updated)
  }

  const addItem = (categoryIndex: number) => {
    const updated = [...skills]
    if (!updated[categoryIndex].items) {
      updated[categoryIndex].items = []
    }
    updated[categoryIndex].items!.push('')
    setSkills(updated)
  }

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const updated = [...skills]
    if (updated[categoryIndex].items) {
      updated[categoryIndex].items = updated[categoryIndex].items!.filter((_, i) => i !== itemIndex)
    }
    setSkills(updated)
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
            <h1 className="font-serif text-4xl text-ocean-deep mb-2">Edit Skills</h1>
            <p className="text-ocean-base">Manage your skills and technologies</p>
          </div>
          <button
            onClick={addCategory}
            className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
          >
            Add Category
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {skills.map((skill, categoryIndex) => (
            <div key={categoryIndex} className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-2xl text-ocean-deep">Category #{categoryIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeCategory(categoryIndex)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Category Name *</label>
                <input
                  type="text"
                  value={skill.category}
                  onChange={(e) => updateCategory(categoryIndex, 'category', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-ocean-deep">Skills *</label>
                  <button
                    type="button"
                    onClick={() => addItem(categoryIndex)}
                    className="text-sm text-teal-base hover:text-teal-dark"
                  >
                    + Add Skill
                  </button>
                </div>
                {(skill.items || []).map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem(categoryIndex, itemIndex, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(categoryIndex, itemIndex)}
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
              disabled={saving || skills.length === 0}
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


