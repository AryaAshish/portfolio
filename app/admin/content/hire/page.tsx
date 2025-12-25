'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { HirePageContent } from '@/types'

export default function EditHirePage() {
  const router = useRouter()
  const [content, setContent] = useState<HirePageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content/hire')
      const data = await response.json()
      if (data.content) {
        // Ensure all required fields exist
        setContent({
          hero: data.content.hero || {
            title: "Engineer by craft.\nDiver by soul.\nRider by heart.",
            subtitle: "Android • Backend • Systems • Writing • Travel • Scuba • Motorcycles",
          },
          summary: data.content.summary || {
            yearsOfExperience: 8,
            currentRole: "Senior Android Engineer",
            location: "Bengaluru, India",
            availability: "Open to new opportunities",
          },
          cta: data.content.cta || {
            title: "Interested in working together?",
            description: "I'm open to senior engineering roles, especially in systems architecture, mobile platforms, and backend infrastructure.",
          },
          contact: data.content.contact || {
            email: "thearyanashish09@gmail.com",
            phone: "+91-9549305633",
            location: "Bengaluru, India",
          },
          resumeUrl: data.content.resumeUrl || "https://sxyfqzblgpqjhqxcomau.supabase.co/storage/v1/object/public/resumes/Ashish_Aryan_Resume.pdf",
        })
      } else {
        setContent({
          hero: {
            title: "Engineer by craft.\nDiver by soul.\nRider by heart.",
            subtitle: "Android • Backend • Systems • Writing • Travel • Scuba • Motorcycles",
          },
          summary: {
            yearsOfExperience: 8,
            currentRole: "Senior Android Engineer",
            location: "Bengaluru, India",
            availability: "Open to new opportunities",
          },
          cta: {
            title: "Interested in working together?",
            description: "I'm open to senior engineering roles, especially in systems architecture, mobile platforms, and backend infrastructure.",
          },
          contact: {
            email: "thearyanashish09@gmail.com",
            phone: "+91-9549305633",
            location: "Bengaluru, India",
          },
          resumeUrl: "https://sxyfqzblgpqjhqxcomau.supabase.co/storage/v1/object/public/resumes/Ashish_Aryan_Resume.pdf",
        })
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
      const response = await fetch('/api/admin/content/hire', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Hire page updated successfully!')
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-ocean-deep mb-2">Edit Hire Page</h1>
          <p className="text-ocean-base">Edit the recruiter-focused hire page content</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">Hero Section</h2>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Title *</label>
              <textarea
                value={content.hero.title}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value }
                })}
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
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value }
                })}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              />
            </div>
          </div>

          <div className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">Professional Summary</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Years of Experience *</label>
                <input
                  type="number"
                  value={content.summary?.yearsOfExperience || 8}
                  onChange={(e) => setContent({
                    ...content,
                    summary: { 
                      ...(content.summary || {}), 
                      yearsOfExperience: parseInt(e.target.value) || 0,
                      location: content.summary?.location || '',
                      availability: content.summary?.availability || '',
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Current Role</label>
                <input
                  type="text"
                  value={content.summary?.currentRole || ''}
                  onChange={(e) => setContent({
                    ...content,
                    summary: { 
                      ...(content.summary || {}), 
                      currentRole: e.target.value,
                      yearsOfExperience: content.summary?.yearsOfExperience || 8,
                      location: content.summary?.location || '',
                      availability: content.summary?.availability || '',
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  placeholder="Senior Android Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Location *</label>
                <input
                  type="text"
                  value={content.summary?.location || ''}
                  onChange={(e) => setContent({
                    ...content,
                    summary: { 
                      ...(content.summary || {}), 
                      location: e.target.value,
                      yearsOfExperience: content.summary?.yearsOfExperience || 8,
                      availability: content.summary?.availability || '',
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Availability *</label>
                <input
                  type="text"
                  value={content.summary?.availability || ''}
                  onChange={(e) => setContent({
                    ...content,
                    summary: { 
                      ...(content.summary || {}), 
                      availability: e.target.value,
                      yearsOfExperience: content.summary?.yearsOfExperience || 8,
                      location: content.summary?.location || '',
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  placeholder="Open to new opportunities"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">Contact Information</h2>
            <p className="text-sm text-ocean-base mb-4">
              This information is displayed in plain text for ATS compatibility
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Email *</label>
                <input
                  type="email"
                  value={content.contact?.email || ''}
                  onChange={(e) => setContent({
                    ...content,
                    contact: { 
                      ...(content.contact || {}), 
                      email: e.target.value,
                      phone: content.contact?.phone || '',
                      location: content.contact?.location || '',
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Phone *</label>
                <input
                  type="tel"
                  value={content.contact?.phone || ''}
                  onChange={(e) => setContent({
                    ...content,
                    contact: { 
                      ...(content.contact || {}), 
                      phone: e.target.value,
                      email: content.contact?.email || '',
                      location: content.contact?.location || '',
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Location *</label>
                <input
                  type="text"
                  value={content.contact?.location || ''}
                  onChange={(e) => setContent({
                    ...content,
                    contact: { 
                      ...(content.contact || {}), 
                      location: e.target.value,
                      email: content.contact?.email || '',
                      phone: content.contact?.phone || '',
                    }
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">Resume</h2>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Resume URL</label>
              <input
                type="url"
                value={content.resumeUrl || ''}
                onChange={(e) => setContent({
                  ...content,
                  resumeUrl: e.target.value
                })}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                placeholder="https://your-project.supabase.co/storage/v1/object/public/resumes/Ashish_Aryan_Resume.pdf"
              />
              <p className="text-xs text-ocean-base/60 mt-1">
                Upload your resume to Supabase Storage (resumes bucket) and paste the public URL here. 
                Or use the upload script: <code className="bg-ocean-light/20 px-1 rounded">npx tsx scripts/upload-resume.ts</code>
              </p>
            </div>
          </div>

          <div className="bg-neutral-white rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">CTA Section</h2>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">CTA Title *</label>
              <input
                type="text"
                value={content.cta.title}
                onChange={(e) => setContent({
                  ...content,
                  cta: { ...content.cta, title: e.target.value }
                })}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">CTA Description *</label>
              <textarea
                value={content.cta.description}
                onChange={(e) => setContent({
                  ...content,
                  cta: { ...content.cta, description: e.target.value }
                })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              />
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

