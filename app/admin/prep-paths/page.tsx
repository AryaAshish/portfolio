'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PrepPath } from '@/types'

export default function PrepPathsAdminPage() {
  const router = useRouter()
  const [paths, setPaths] = useState<PrepPath[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPaths()
  }, [])

  const fetchPaths = async () => {
    try {
      const response = await fetch('/api/admin/prep-paths')
      const data = await response.json()
      if (data.paths) {
        setPaths(data.paths)
      }
    } catch (error) {
      console.error('Failed to fetch prep paths:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prep path? This will also delete all topics, questions, and resources.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/prep-paths/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        setPaths(paths.filter(p => p.id !== id))
        alert('Prep path deleted successfully!')
      } else {
        alert(data.message || 'Failed to delete')
      }
    } catch (error) {
      alert('Error deleting prep path')
    }
  }

  const togglePublished = async (path: PrepPath) => {
    try {
      const response = await fetch(`/api/admin/prep-paths/${path.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !path.published }),
      })

      const data = await response.json()
      if (data.success) {
        setPaths(paths.map(p => p.id === path.id ? { ...p, published: !p.published } : p))
      } else {
        alert(data.message || 'Failed to update')
      }
    } catch (error) {
      alert('Error updating prep path')
    }
  }

  if (loading) {
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
            <h1 className="font-serif text-4xl text-ocean-deep mb-2">Prep Paths</h1>
            <p className="text-ocean-base">Manage interview preparation learning paths</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="px-6 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors"
            >
              Back to Admin
            </Link>
            <Link
              href="/admin/prep-paths/new"
              className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
            >
              + New Prep Path
            </Link>
          </div>
        </div>

        {paths.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path) => (
              <div
                key={path.id}
                className="bg-neutral-white rounded-xl p-6 shadow-lg border border-ocean-light/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${path.color}20`, color: path.color }}
                  >
                    {path.icon || '📚'}
                  </div>
                  <button
                    onClick={() => togglePublished(path)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      path.published
                        ? 'bg-teal-light/20 text-teal-dark'
                        : 'bg-ocean-light/20 text-ocean-base'
                    }`}
                  >
                    {path.published ? 'Published' : 'Draft'}
                  </button>
                </div>
                <h3 className="font-serif text-2xl text-ocean-deep mb-2">{path.title}</h3>
                <p className="text-ocean-base mb-4 line-clamp-2 text-sm">{path.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-ocean-light uppercase">{path.category}</span>
                  <span className="text-ocean-light">•</span>
                  <span className="text-xs text-ocean-light">{path.difficulty}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/prep-paths/${path.id}`}
                    className="flex-1 px-4 py-2 bg-ocean-pale/20 text-ocean-base rounded-lg text-sm font-medium hover:bg-teal-light/20 transition-colors text-center"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/prep/${path.id}`}
                    target="_blank"
                    className="px-4 py-2 bg-teal-base/10 text-teal-base rounded-lg text-sm font-medium hover:bg-teal-base/20 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(path.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-white rounded-xl p-12 text-center shadow-lg">
            <p className="text-ocean-base text-lg mb-4">No prep paths yet.</p>
            <Link
              href="/admin/prep-paths/new"
              className="inline-block px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
            >
              Create Your First Prep Path
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

