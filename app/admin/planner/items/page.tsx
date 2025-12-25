'use client'

import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { ImportantItem } from '@/types'

export default function ImportantItemsPage() {
  const [items, setItems] = useState<ImportantItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ImportantItem | null>(null)
  const [filters, setFilters] = useState({
    status: 'active',
    priority: '',
    type: '',
  })

  useEffect(() => {
    fetchItems()
  }, [filters])

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.type) params.append('type', filters.type)

      const response = await fetch(`/api/admin/planner/items?${params.toString()}`)
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = async (id: string, action: 'complete' | 'archive', newStatus: ImportantItem['status']) => {
    try {
      const response = await fetch(`/api/admin/planner/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update item')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/admin/planner/items/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const priorityColors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700 border-red-300',
    high: 'bg-orange-100 text-orange-700 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    low: 'bg-gray-100 text-gray-700 border-gray-300',
  }

  const typeIcons: Record<string, string> = {
    note: '📝',
    todo: '✓',
    reminder: '⏰',
    goal: '🎯',
    idea: '💡',
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin/planner"
              className="text-teal-base hover:text-teal-dark mb-2 inline-block"
            >
              ← Back to Planner
            </Link>
            <h1 className="font-serif text-4xl text-ocean-deep">Important Items</h1>
          </div>
          <button
            onClick={() => {
              setSelectedItem(null)
              setShowForm(true)
            }}
            className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
          >
            + New Item
          </button>
        </div>

        <div className="bg-neutral-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="font-serif text-xl text-ocean-deep mb-4">Filters</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              >
                <option value="">All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              >
                <option value="">All</option>
                <option value="note">Note</option>
                <option value="todo">Todo</option>
                <option value="reminder">Reminder</option>
                <option value="goal">Goal</option>
                <option value="idea">Idea</option>
              </select>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-neutral-white rounded-xl p-12 text-center shadow-lg">
            <p className="text-ocean-base mb-4">No items found</p>
            <button
              onClick={() => {
                setSelectedItem(null)
                setShowForm(true)
              }}
              className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
            >
              Create Your First Item
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-neutral-white rounded-xl p-6 shadow-lg border-2 ${
                  priorityColors[item.priority]
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{typeIcons[item.type]}</span>
                    <div>
                      <h3 className="font-serif text-xl text-ocean-deep">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${
                          priorityColors[item.priority]
                        }`}>
                          {item.priority}
                        </span>
                        <span className="text-xs text-ocean-light capitalize">{item.type}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'archived'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {item.description && (
                  <p className="text-ocean-base mb-4 whitespace-pre-wrap">{item.description}</p>
                )}

                {item.dueDate && (
                  <div className="mb-4">
                    <p className="text-sm text-ocean-light">
                      Due: <span className="font-medium text-ocean-deep">
                        {format(parseISO(item.dueDate), 'MMM d, yyyy')}
                      </span>
                    </p>
                  </div>
                )}

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-ocean-pale/20 text-ocean-base rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-ocean-light/20">
                  {item.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleQuickAction(item.id, 'complete', 'completed')}
                        className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                      >
                        ✓ Complete
                      </button>
                      <button
                        onClick={() => handleQuickAction(item.id, 'archive', 'archived')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Archive
                      </button>
                    </>
                  )}
                  {item.status === 'completed' && (
                    <button
                      onClick={() => handleQuickAction(item.id, 'archive', 'archived')}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedItem(item)
                      setShowForm(true)
                    }}
                    className="px-4 py-2 bg-ocean-pale/20 text-ocean-base rounded-lg text-sm font-medium hover:bg-teal-light/20 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <ItemForm
            item={selectedItem}
            onClose={() => {
              setShowForm(false)
              setSelectedItem(null)
            }}
            onSave={() => {
              fetchItems()
              setShowForm(false)
              setSelectedItem(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

function ItemForm({
  item,
  onClose,
  onSave,
}: {
  item?: ImportantItem | null
  onClose: () => void
  onSave: () => void
}) {
  const [title, setTitle] = useState(item?.title || '')
  const [description, setDescription] = useState(item?.description || '')
  const [type, setType] = useState<ImportantItem['type']>(item?.type || 'note')
  const [priority, setPriority] = useState<ImportantItem['priority']>(item?.priority || 'medium')
  const [status, setStatus] = useState<ImportantItem['status']>(item?.status || 'active')
  const [dueDate, setDueDate] = useState(item?.dueDate || '')
  const [tags, setTags] = useState(item?.tags.join(', ') || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const itemData = {
        title,
        description: description || undefined,
        type,
        priority,
        status,
        dueDate: dueDate || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      }

      const url = item ? `/api/admin/planner/items/${item.id}` : '/api/admin/planner/items'
      const method = item ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      })

      const data = await response.json()

      if (data.success) {
        onSave()
      } else {
        alert(data.message || 'Failed to save item')
      }
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl text-ocean-deep">
            {item ? 'Edit Item' : 'New Important Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-ocean-light hover:text-ocean-deep transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Add details..."
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ImportantItem['type'])}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              >
                <option value="note">Note</option>
                <option value="todo">Todo</option>
                <option value="reminder">Reminder</option>
                <option value="goal">Goal</option>
                <option value="idea">Idea</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ImportantItem['priority'])}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ImportantItem['status'])}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Due Date (optional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, personal, urgent..."
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
            </button>
            <button
              type="button"
              onClick={onClose}
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


