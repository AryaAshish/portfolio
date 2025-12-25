'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { CalendarEvent, JournalEntry, FinanceTransaction, ImportantItem } from '@/types'

export default function PlannerDashboard() {
  const [loading, setLoading] = useState(true)
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([])
  const [recentJournals, setRecentJournals] = useState<JournalEntry[]>([])
  const [monthlyStats, setMonthlyStats] = useState({ income: 0, expenses: 0 })
  const [pendingItems, setPendingItems] = useState<ImportantItem[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')

      const [eventsRes, journalsRes, financesRes, itemsRes] = await Promise.all([
        fetch(`/api/admin/planner/calendar?startDate=${today}&endDate=${today}`),
        fetch(`/api/admin/planner/journal?startDate=${monthStart}&endDate=${monthEnd}`),
        fetch(`/api/admin/planner/finances?startDate=${monthStart}&endDate=${monthEnd}`),
        fetch('/api/admin/planner/items?status=active'),
      ])

      const eventsData = await eventsRes.json()
      const journalsData = await journalsRes.json()
      const financesData = await financesRes.json()
      const itemsData = await itemsRes.json()

      setTodayEvents(eventsData.events || [])
      setRecentJournals((journalsData.entries || []).slice(0, 5))
      
      const transactions = financesData.transactions || []
      const income = transactions.filter((t: FinanceTransaction) => t.type === 'income').reduce((sum: number, t: FinanceTransaction) => sum + t.amount, 0)
      const expenses = transactions.filter((t: FinanceTransaction) => t.type === 'expense').reduce((sum: number, t: FinanceTransaction) => sum + t.amount, 0)
      setMonthlyStats({ income, expenses })

      const urgentItems = (itemsData.items || []).filter((item: ImportantItem) =>
        item.priority === 'high'
      ).slice(0, 5)
      setPendingItems(urgentItems)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl text-ocean-deep">Personal Planner</h1>
          <Link
            href="/admin"
            className="px-6 py-3 bg-ocean-light text-ocean-deep rounded-lg font-medium hover:bg-ocean-base transition-colors"
          >
            Back to Admin
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link
            href="/admin/planner/calendar"
            className="bg-gradient-to-br from-teal-base to-teal-dark rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-neutral-white"
          >
            <h3 className="font-serif text-2xl mb-2">Calendar</h3>
            <p className="text-neutral-white/90 text-sm mb-4">Events & Schedule</p>
            <div className="text-3xl font-bold">{todayEvents.length}</div>
            <p className="text-sm text-neutral-white/80">Events today</p>
          </Link>

          <Link
            href="/admin/planner/journal"
            className="bg-gradient-to-br from-ocean-deep to-ocean-dark rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-neutral-white"
          >
            <h3 className="font-serif text-2xl mb-2">Journal</h3>
            <p className="text-neutral-white/90 text-sm mb-4">Daily Reflections</p>
            <div className="text-3xl font-bold">{recentJournals.length}</div>
            <p className="text-sm text-neutral-white/80">This month</p>
          </Link>

          <Link
            href="/admin/planner/finances"
            className="bg-gradient-to-br from-teal-dark to-teal-base rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-neutral-white"
          >
            <h3 className="font-serif text-2xl mb-2">Finances</h3>
            <p className="text-neutral-white/90 text-sm mb-4">Income & Expenses</p>
            <div className="text-3xl font-bold">₹{monthlyStats.income - monthlyStats.expenses}</div>
            <p className="text-sm text-neutral-white/80">Net this month</p>
          </Link>

          <Link
            href="/admin/planner/items"
            className="bg-gradient-to-br from-ocean-dark to-ocean-base rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-neutral-white"
          >
            <h3 className="font-serif text-2xl mb-2">Important Items</h3>
            <p className="text-neutral-white/90 text-sm mb-4">Notes & Tasks</p>
            <div className="text-3xl font-bold">{pendingItems.length}</div>
            <p className="text-sm text-neutral-white/80">High priority</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-neutral-white rounded-xl p-6 shadow-lg">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">Today&apos;s Events</h2>
            {todayEvents.length === 0 ? (
              <p className="text-ocean-base">No events scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border border-ocean-light/20">
                    <div
                      className="w-3 h-3 rounded-full mt-1.5"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-ocean-deep">{event.title}</h3>
                      {event.location && (
                        <p className="text-sm text-ocean-light">📍 {event.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-neutral-white rounded-xl p-6 shadow-lg">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">Recent Journal Entries</h2>
            {recentJournals.length === 0 ? (
              <p className="text-ocean-base">No journal entries this month</p>
            ) : (
              <div className="space-y-3">
                {recentJournals.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/admin/planner/journal/${entry.date}`}
                    className="block p-3 rounded-lg border border-ocean-light/20 hover:bg-ocean-pale/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-ocean-deep">
                        {format(new Date(entry.date), 'MMM d, yyyy')}
                      </span>
                      {entry.mood && (
                        <span className="text-sm text-ocean-light capitalize">{entry.mood}</span>
                      )}
                    </div>
                    {entry.title && (
                      <p className="text-sm text-ocean-base font-medium">{entry.title}</p>
                    )}
                    <p className="text-sm text-ocean-light line-clamp-2 mt-1">
                      {entry.content.substring(0, 100)}...
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-neutral-white rounded-xl p-6 shadow-lg">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">Monthly Finances</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-ocean-base">Income</span>
                <span className="font-semibold text-teal-dark">₹{monthlyStats.income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ocean-base">Expenses</span>
                <span className="font-semibold text-red-600">₹{monthlyStats.expenses.toLocaleString()}</span>
              </div>
              <div className="border-t border-ocean-light/20 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-ocean-deep">Net</span>
                  <span className={`font-bold text-lg ${
                    monthlyStats.income - monthlyStats.expenses >= 0 ? 'text-teal-dark' : 'text-red-600'
                  }`}>
                    ₹{(monthlyStats.income - monthlyStats.expenses).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-white rounded-xl p-6 shadow-lg">
            <h2 className="font-serif text-2xl text-ocean-deep mb-4">High Priority Items</h2>
            {pendingItems.length === 0 ? (
              <p className="text-ocean-base">No high priority items</p>
            ) : (
              <div className="space-y-3">
                {pendingItems.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg border border-ocean-light/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.priority === 'high' ? 'bg-red-100 text-red-700' :
                        item.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-ocean-light capitalize">{item.type}</span>
                    </div>
                    <h3 className="font-medium text-ocean-deep">{item.title}</h3>
                    {item.dueDate && (
                      <p className="text-xs text-ocean-light mt-1">
                        Due: {format(new Date(item.dueDate), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

