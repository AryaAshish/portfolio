'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PrepPath } from '@/types'

const categories: PrepPath['category'][] = ['android', 'system-design', 'dsa', 'frontend', 'backend', 'devops', 'other']
const difficulties: PrepPath['difficulty'][] = ['beginner', 'intermediate', 'advanced']

export default function NewPrepPathPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Omit<PrepPath, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    icon: '',
    color: '#14a085',
    category: 'android',
    difficulty: 'intermediate',
    estimatedTime: '',
    published: false,
    order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/prep-paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        alert('Prep path created successfully!')
        router.push(`/admin/prep-paths/${data.path.id}`)
      } else {
        alert(data.message || 'Failed to create prep path')
      }
    } catch (error) {
      alert('Error creating prep path')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-ocean-deep mb-2">New Prep Path</h1>
          <p className="text-ocean-base">Create a new interview preparation learning path</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-white rounded-xl p-6 md:p-8 shadow-lg space-y-6">
          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as PrepPath['category'] })}
                className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-base"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">Difficulty *</label>
              <select
                required
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as PrepPath['difficulty'] })}
                className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-base"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">Icon (emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📚"
                className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ocean-deep mb-2">Color *</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-10 border border-ocean-light/20 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1 px-4 py-2 border border-ocean-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">Estimated Time</label>
            <input
              type="text"
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
              placeholder="e.g., 2-3 months"
              className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ocean-deep mb-2">Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-ocean-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-teal-base rounded focus:ring-teal-base"
            />
            <label htmlFor="published" className="text-sm font-semibold text-ocean-deep">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Prep Path'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
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

