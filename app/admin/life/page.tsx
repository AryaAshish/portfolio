'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LifeMoment } from '@/types'

export default function LifeMomentsAdminPage() {
  const [moments, setMoments] = useState<LifeMoment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMoments()
  }, [])

  const fetchMoments = async () => {
    try {
      const response = await fetch('/api/admin/content/life')
      const data = await response.json()
      if (data.moments) {
        setMoments(data.moments)
      }
    } catch (error) {
      console.error('Failed to fetch moments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this moment?')) return

    try {
      const updatedMoments = moments.filter(m => m.id !== id)
      const response = await fetch('/api/admin/content/life', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moments: updatedMoments }),
      })

      if (response.ok) {
        fetchMoments()
      } else {
        alert('Failed to delete moment')
      }
    } catch (error) {
      alert('Error deleting moment')
    }
  }

  const typeLabels: Record<LifeMoment['type'], string> = {
    scuba: 'Scuba Dive',
    motorcycle: 'Motorcycle',
    travel: 'Travel',
    reflection: 'Reflection',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-4xl text-ocean-deep mb-2">Life Moments</h1>
            <p className="text-ocean-base">Manage scuba dives, bike rides, travel moments, and reflections</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/life/new"
              className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
            >
              New Moment
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        <div className="bg-neutral-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-ocean-deep text-neutral-white">
            <h2 className="font-serif text-2xl">All Moments</h2>
          </div>
          <table className="w-full">
            <thead className="bg-ocean-pale/20">
              <tr>
                <th className="px-6 py-4 text-left font-serif text-ocean-deep">Title</th>
                <th className="px-6 py-4 text-left font-serif text-ocean-deep">Type</th>
                <th className="px-6 py-4 text-left font-serif text-ocean-deep">Location</th>
                <th className="px-6 py-4 text-left font-serif text-ocean-deep">Date</th>
                <th className="px-6 py-4 text-left font-serif text-ocean-deep">Actions</th>
              </tr>
            </thead>
            <tbody>
              {moments.map((moment) => (
                <tr key={moment.id} className="border-b border-ocean-light/20">
                  <td className="px-6 py-4">
                    <div className="font-medium text-ocean-deep">{moment.title}</div>
                    <div className="text-sm text-ocean-light line-clamp-1">{moment.description.substring(0, 100)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-light/20 text-teal-dark">
                      {typeLabels[moment.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ocean-base text-sm">
                    {moment.location || '-'}
                  </td>
                  <td className="px-6 py-4 text-ocean-base">
                    {new Date(moment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/life/${moment.id}`}
                        className="px-4 py-2 bg-ocean-pale/20 text-ocean-base rounded-lg text-sm font-medium hover:bg-teal-light/20 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(moment.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {moments.length === 0 && (
            <div className="p-12 text-center text-ocean-base">
              <p>No life moments yet. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
