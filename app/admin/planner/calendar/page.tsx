'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import Link from 'next/link'
import { CalendarEvent } from '@/types'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    try {
      const monthStart = format(startOfMonth(currentDate), 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(currentDate), 'yyyy-MM-dd')
      const response = await fetch(`/api/admin/planner/calendar?startDate=${monthStart}&endDate=${monthEnd}`)
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate)
      return isSameDay(eventDate, date)
    })
  }

  const eventTypeColors: Record<string, string> = {
    event: '#3b82f6',
    meeting: '#8b5cf6',
    deadline: '#ef4444',
    reminder: '#f59e0b',
    task: '#10b981',
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowEventModal(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/admin/planner/calendar/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchEvents()
        setShowEventModal(false)
        setSelectedEvent(null)
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-off py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin/planner"
              className="text-teal-base hover:text-teal-dark mb-2 inline-block"
            >
              ← Back to Planner
            </Link>
            <h1 className="font-serif text-4xl text-ocean-deep">Calendar</h1>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="px-4 py-2 bg-ocean-pale/20 text-ocean-deep rounded-lg font-medium hover:bg-ocean-pale/30 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="px-4 py-2 bg-ocean-pale/20 text-ocean-deep rounded-lg font-medium hover:bg-ocean-pale/30 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-serif text-3xl text-ocean-deep">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-ocean-base">Loading calendar...</p>
          </div>
        ) : (
          <div className="bg-neutral-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-7 border-b border-ocean-light/20">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-4 text-center font-semibold text-ocean-deep bg-ocean-pale/10">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day, idx) => {
                const dayEvents = getEventsForDate(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isToday = isSameDay(day, new Date())

                return (
                  <div
                    key={idx}
                    className={`min-h-[120px] p-2 border-r border-b border-ocean-light/20 ${
                      !isCurrentMonth ? 'bg-ocean-pale/5' : 'bg-neutral-white'
                    } ${isToday ? 'bg-teal-light/10' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          isToday
                            ? 'bg-teal-base text-neutral-white rounded-full w-6 h-6 flex items-center justify-center'
                            : isCurrentMonth
                            ? 'text-ocean-deep'
                            : 'text-ocean-light'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>
                      <button
                        onClick={() => handleDateClick(day)}
                        className="text-xs text-teal-base hover:text-teal-dark font-medium"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className="w-full text-left text-xs px-2 py-1 rounded truncate hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: event.color + '20',
                            color: event.color,
                            borderLeft: `3px solid ${event.color}`,
                          }}
                          title={event.title}
                        >
                          {event.title}
                        </button>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-ocean-light px-2">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {showEventModal && (
          <EventModal
            event={selectedEvent}
            date={selectedDate}
            onClose={() => {
              setShowEventModal(false)
              setSelectedEvent(null)
              setSelectedDate(null)
            }}
            onSave={() => {
              fetchEvents()
              setShowEventModal(false)
              setSelectedEvent(null)
              setSelectedDate(null)
            }}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </div>
  )
}

function EventModal({
  event,
  date,
  onClose,
  onSave,
  onDelete,
}: {
  event?: CalendarEvent | null
  date?: Date | null
  onClose: () => void
  onSave: () => void
  onDelete: (id: string) => void
}) {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [startDate, setStartDate] = useState(
    event?.startDate ? format(new Date(event.startDate), 'yyyy-MM-dd') : date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  )
  const [startTime, setStartTime] = useState(
    event?.startDate && !event.allDay ? format(new Date(event.startDate), 'HH:mm') : '09:00'
  )
  const [endDate, setEndDate] = useState(
    event?.endDate ? format(new Date(event.endDate), 'yyyy-MM-dd') : date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  )
  const [endTime, setEndTime] = useState(
    event?.endDate && !event.allDay ? format(new Date(event.endDate), 'HH:mm') : '10:00'
  )
  const [allDay, setAllDay] = useState(event?.allDay ?? false)
  const [eventType, setEventType] = useState<CalendarEvent['eventType']>(event?.eventType || 'event')
  const [location, setLocation] = useState(event?.location || '')
  const [saving, setSaving] = useState(false)

  const eventTypeColors: Record<string, string> = {
    event: '#3b82f6',
    meeting: '#8b5cf6',
    deadline: '#ef4444',
    reminder: '#f59e0b',
    task: '#10b981',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const startDateTime = allDay ? startDate : `${startDate}T${startTime}:00`
      const endDateTime = allDay ? endDate : `${endDate}T${endTime}:00`

      const eventData = {
        title,
        description,
        startDate: startDateTime,
        endDate: endDateTime,
        allDay,
        eventType,
        color: eventTypeColors[eventType],
        location,
      }

      const url = event ? `/api/admin/planner/calendar/${event.id}` : '/api/admin/planner/calendar'
      const method = event ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()

      if (data.success) {
        onSave()
      } else {
        alert(data.message || 'Failed to save event')
      }
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl text-ocean-deep">
            {event ? 'Edit Event' : 'New Event'}
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
            <label className="block text-sm font-medium text-ocean-deep mb-2">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as CalendarEvent['eventType'])}
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            >
              <option value="event">Event</option>
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="reminder">Reminder</option>
              <option value="task">Task</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allDay"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="w-4 h-4 text-teal-base rounded focus:ring-teal-base"
            />
            <label htmlFor="allDay" className="text-sm font-medium text-ocean-deep">
              All Day
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              />
            </div>
            {!allDay && (
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>
            {!allDay && (
              <div>
                <label className="block text-sm font-medium text-ocean-deep mb-2">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
            </button>
            {event && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            )}
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


