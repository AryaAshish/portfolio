'use client'

import { useState, useEffect } from 'react'
import { NewsletterSubscriber } from '@/types'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/subscribers')
      const data = await response.json()

      if (data.success) {
        setSubscribers(data.subscribers || [])
      } else {
        setError(data.message || 'Failed to fetch subscribers')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = ['Email', 'Name', 'Source', 'Subscribed At']
    const rows = subscribers.map((sub) => [
      sub.email,
      sub.name || '',
      sub.source || '',
      new Date().toISOString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-off py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-ocean-base">Loading subscribers...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-off py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
            {error.includes('not enabled') && (
              <div className="mt-2 text-sm">
                To enable Supabase, set <code className="bg-red-100 px-1 rounded">USE_SUPABASE=true</code> in your{' '}
                <code className="bg-red-100 px-1 rounded">.env.local</code> file.
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-off py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="font-serif text-3xl text-ocean-deep mb-2 heading-serif">Newsletter Subscribers</h1>
              <p className="text-ocean-base">
                {subscribers.length} {subscribers.length === 1 ? 'subscriber' : 'subscribers'}
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-teal-base text-neutral-white rounded-lg hover:bg-teal-dark transition-colors"
            >
              Export CSV
            </button>
          </div>

          {subscribers.length === 0 ? (
            <div className="text-center py-12 text-ocean-base">
              <p>No subscribers yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ocean-light">
                    <th className="text-left py-3 px-4 text-ocean-deep font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-ocean-deep font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-ocean-deep font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber, index) => (
                    <tr key={index} className="border-b border-ocean-light/30 hover:bg-ocean-pale/10">
                      <td className="py-3 px-4 text-ocean-base">{subscriber.email}</td>
                      <td className="py-3 px-4 text-ocean-base">{subscriber.name || '-'}</td>
                      <td className="py-3 px-4 text-ocean-base">
                        <span className="px-2 py-1 bg-ocean-pale/20 rounded text-sm">
                          {subscriber.source || 'unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


