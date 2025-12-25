'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HomeContent } from '@/lib/home'
import { ImageUpload } from '@/components/ImageUpload'
import { HeroImageCropper } from '@/components/HeroImageCropper'

export default function EditHomePage() {
  const router = useRouter()
  const [content, setContent] = useState<HomeContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content/home')
      const data = await response.json()
      if (data.content) {
        setContent(data.content)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content) return

    setSaving(true)

    try {
      const response = await fetch('/api/admin/content/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Home page updated successfully!')
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

  const updateHero = (field: string, value: any) => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        [field]: value,
      },
    })
  }

  const updateCta = (type: 'primary' | 'secondary' | 'tertiary', field: 'text' | 'href', value: string) => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        cta: {
          ...content.hero.cta,
          [type]: {
            ...content.hero.cta[type],
            [field]: value,
          },
        },
      },
    })
  }

  const updateSection = (section: 'whatImGoodAt' | 'whatIDontOptimizeFor' | 'hiring', field: string, value: any) => {
    if (!content) return
    setContent({
      ...content,
      [section]: {
        ...content[section],
        [field]: value,
      },
    })
  }

  const updateItem = (
    section: 'whatImGoodAt' | 'whatIDontOptimizeFor',
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    if (!content) return
    const updated = [...content[section].items]
    updated[index] = { ...updated[index], [field]: value }
    setContent({
      ...content,
      [section]: {
        ...content[section],
        items: updated,
      },
    })
  }

  const addItem = (section: 'whatImGoodAt' | 'whatIDontOptimizeFor') => {
    if (!content) return
    setContent({
      ...content,
      [section]: {
        ...content[section],
        items: [...content[section].items, { title: '', description: '' }],
      },
    })
  }

  const removeItem = (section: 'whatImGoodAt' | 'whatIDontOptimizeFor', index: number) => {
    if (!content) return
    setContent({
      ...content,
      [section]: {
        ...content[section],
        items: content[section].items.filter((_, i) => i !== index),
      },
    })
  }

  const updateList = (section: 'roles' | 'teams', index: number, value: string) => {
    if (!content) return
    const list = [...content.hiring[section]]
    list[index] = value
    setContent({
      ...content,
      hiring: {
        ...content.hiring,
        [section]: list,
      },
    })
  }

  const addListItem = (section: 'roles' | 'teams') => {
    if (!content) return
    setContent({
      ...content,
      hiring: {
        ...content.hiring,
        [section]: [...content.hiring[section], ''],
      },
    })
  }

  const removeListItem = (section: 'roles' | 'teams', index: number) => {
    if (!content) return
    setContent({
      ...content,
      hiring: {
        ...content.hiring,
        [section]: content.hiring[section].filter((_, i) => i !== index),
      },
    })
  }

  const updateHiringCta = (type: 'primary' | 'secondary', field: 'text' | 'href', value: string) => {
    if (!content) return
    setContent({
      ...content,
      hiring: {
        ...content.hiring,
        cta: {
          ...content.hiring.cta,
          [type]: {
            ...content.hiring.cta[type],
            [field]: value,
          },
        },
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-off flex items-center justify-center">
        <p className="text-ocean-base">Loading...</p>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-neutral-off flex items-center justify-center">
        <p className="text-ocean-base">Content not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-ocean-deep mb-2">Edit Home Page</h1>
          <p className="text-ocean-base">Edit all home page content</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">Hero Section</h2>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Title *</label>
              <textarea
                value={content.hero.title}
                onChange={(e) => updateHero('title', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
                placeholder="Use \n for line breaks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Subtitle *</label>
              <input
                type="text"
                value={content.hero.subtitle}
                onChange={(e) => updateHero('subtitle', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              />
            </div>
            <div>
              <HeroImageCropper
                images={content.hero.coralImages || []}
                onChange={(images) => updateHero('coralImages', images)}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Primary CTA Text</label>
                <input
                  type="text"
                  value={content.hero.cta.primary.text}
                  onChange={(e) => updateCta('primary', 'text', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Primary CTA Link</label>
                <input
                  type="text"
                  value={content.hero.cta.primary.href}
                  onChange={(e) => updateCta('primary', 'href', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Secondary CTA Text</label>
                <input
                  type="text"
                  value={content.hero.cta.secondary.text}
                  onChange={(e) => updateCta('secondary', 'text', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Secondary CTA Link</label>
                <input
                  type="text"
                  value={content.hero.cta.secondary.href}
                  onChange={(e) => updateCta('secondary', 'href', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Tertiary CTA Text</label>
                <input
                  type="text"
                  value={content.hero.cta.tertiary.text}
                  onChange={(e) => updateCta('tertiary', 'text', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Tertiary CTA Link</label>
                <input
                  type="text"
                  value={content.hero.cta.tertiary.href}
                  onChange={(e) => updateCta('tertiary', 'href', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
            </div>
          </div>

          <div className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-2xl text-ocean-deep">What I&apos;m Good At</h2>
              <button
                type="button"
                onClick={() => addItem('whatImGoodAt')}
                className="px-4 py-2 bg-teal-base text-neutral-white rounded-lg text-sm font-medium hover:bg-teal-dark"
              >
                + Add Item
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Title</label>
              <input
                type="text"
                value={content.whatImGoodAt.title}
                onChange={(e) => updateSection('whatImGoodAt', 'title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Description</label>
              <textarea
                value={content.whatImGoodAt.description}
                onChange={(e) => updateSection('whatImGoodAt', 'description', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>
            {content.whatImGoodAt.items.map((item, index) => (
              <div key={index} className="p-4 bg-ocean-pale/10 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-ocean-deep">Item {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('whatImGoodAt', index)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem('whatImGoodAt', index, 'title', e.target.value)}
                  placeholder="Title"
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem('whatImGoodAt', index, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
            ))}
          </div>

          <div className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-2xl text-ocean-deep">What I Don&apos;t Optimize For</h2>
              <button
                type="button"
                onClick={() => addItem('whatIDontOptimizeFor')}
                className="px-4 py-2 bg-teal-base text-neutral-white rounded-lg text-sm font-medium hover:bg-teal-dark"
              >
                + Add Item
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Title</label>
              <input
                type="text"
                value={content.whatIDontOptimizeFor.title}
                onChange={(e) => updateSection('whatIDontOptimizeFor', 'title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Description</label>
              <textarea
                value={content.whatIDontOptimizeFor.description}
                onChange={(e) => updateSection('whatIDontOptimizeFor', 'description', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>
            {content.whatIDontOptimizeFor.items.map((item, index) => (
              <div key={index} className="p-4 bg-ocean-pale/10 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-ocean-deep">Item {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeItem('whatIDontOptimizeFor', index)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem('whatIDontOptimizeFor', index, 'title', e.target.value)}
                  placeholder="Title"
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem('whatIDontOptimizeFor', index, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
            ))}
          </div>

          <div className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">Hiring Section</h2>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Title</label>
              <input
                type="text"
                value={content.hiring.title}
                onChange={(e) => updateSection('hiring', 'title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-ocean-deep">Roles I Fit</label>
                <button
                  type="button"
                  onClick={() => addListItem('roles')}
                  className="text-sm text-teal-base hover:text-teal-dark"
                >
                  + Add
                </button>
              </div>
              {content.hiring.roles.map((role, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => updateList('roles', index, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('roles', index)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-ocean-deep">Teams I Do Best In</label>
                <button
                  type="button"
                  onClick={() => addListItem('teams')}
                  className="text-sm text-teal-base hover:text-teal-dark"
                >
                  + Add
                </button>
              </div>
              {content.hiring.teams.map((team, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => updateList('teams', index, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem('teams', index)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Primary CTA Text</label>
                <input
                  type="text"
                  value={content.hiring.cta.primary.text}
                  onChange={(e) => updateHiringCta('primary', 'text', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Primary CTA Link</label>
                <input
                  type="text"
                  value={content.hiring.cta.primary.href}
                  onChange={(e) => updateHiringCta('primary', 'href', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Secondary CTA Text</label>
                <input
                  type="text"
                  value={content.hiring.cta.secondary.text}
                  onChange={(e) => updateHiringCta('secondary', 'text', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Secondary CTA Link</label>
                <input
                  type="text"
                  value={content.hiring.cta.secondary.href}
                  onChange={(e) => updateHiringCta('secondary', 'href', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
            </div>
          </div>

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

