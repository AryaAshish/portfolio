'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import Link from 'next/link'
import { FinanceTransaction, FinanceAnalytics } from '@/types'

export default function FinancesPage() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([])
  const [analytics, setAnalytics] = useState<FinanceAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<FinanceTransaction | null>(null)
  const [filters, setFilters] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    type: '',
    category: '',
  })

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.type) params.append('type', filters.type)
      if (filters.category) params.append('category', filters.category)

      const [transactionsRes, analyticsRes] = await Promise.all([
        fetch(`/api/admin/planner/finances?${params.toString()}`),
        fetch(`/api/admin/planner/finances/analytics?startDate=${filters.startDate}&endDate=${filters.endDate}`),
      ])

      const transactionsData = await transactionsRes.json()
      const analyticsData = await analyticsRes.json()

      setTransactions(transactionsData.transactions || [])
      setAnalytics(analyticsData.analytics || null)
    } catch (error) {
      console.error('Error fetching finances:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    try {
      const response = await fetch(`/api/admin/planner/finances/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Failed to delete transaction')
    }
  }

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other']
  const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Travel', 'Other']

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
          <div>
            <Link
              href="/admin/planner"
              className="text-teal-base hover:text-teal-dark mb-2 inline-block"
            >
              ← Back to Planner
            </Link>
            <h1 className="font-serif text-4xl text-ocean-deep">Finances</h1>
          </div>
          <button
            onClick={() => {
              setSelectedTransaction(null)
              setShowForm(true)
            }}
            className="px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors"
          >
            + Add Transaction
          </button>
        </div>

        {analytics && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-teal-base to-teal-dark rounded-xl p-6 text-neutral-white shadow-lg">
              <h3 className="text-sm font-medium mb-2 opacity-90">Total Income</h3>
              <p className="text-3xl font-bold">₹{analytics.totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-neutral-white shadow-lg">
              <h3 className="text-sm font-medium mb-2 opacity-90">Total Expenses</h3>
              <p className="text-3xl font-bold">₹{analytics.totalExpenses.toLocaleString()}</p>
            </div>
            <div className={`bg-gradient-to-br rounded-xl p-6 text-neutral-white shadow-lg ${
              analytics.netAmount >= 0
                ? 'from-green-500 to-green-600'
                : 'from-orange-500 to-orange-600'
            }`}>
              <h3 className="text-sm font-medium mb-2 opacity-90">Net Amount</h3>
              <p className="text-3xl font-bold">₹{analytics.netAmount.toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="bg-neutral-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="font-serif text-xl text-ocean-deep mb-4">Filters</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Category</label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                placeholder="Filter by category..."
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
              />
            </div>
          </div>
        </div>

        {analytics && analytics.categoryBreakdown.length > 0 && (
          <div className="bg-neutral-white rounded-xl p-6 shadow-lg mb-6">
            <h2 className="font-serif text-xl text-ocean-deep mb-4">Expense Breakdown</h2>
            <div className="space-y-3">
              {analytics.categoryBreakdown
                .sort((a, b) => b.amount - a.amount)
                .map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className="text-ocean-base font-medium">{item.category}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-48 bg-ocean-pale/20 rounded-full h-2">
                        <div
                          className="bg-teal-base h-2 rounded-full"
                          style={{
                            width: `${(item.amount / analytics.totalExpenses) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-ocean-deep font-semibold w-24 text-right">
                        ₹{item.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="bg-neutral-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-ocean-deep text-neutral-white">
            <h2 className="font-serif text-2xl">Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ocean-pale/20">
                <tr>
                  <th className="px-6 py-4 text-left font-serif text-ocean-deep">Date</th>
                  <th className="px-6 py-4 text-left font-serif text-ocean-deep">Type</th>
                  <th className="px-6 py-4 text-left font-serif text-ocean-deep">Category</th>
                  <th className="px-6 py-4 text-left font-serif text-ocean-deep">Description</th>
                  <th className="px-6 py-4 text-right font-serif text-ocean-deep">Amount</th>
                  <th className="px-6 py-4 text-left font-serif text-ocean-deep">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-ocean-light/20 hover:bg-ocean-pale/5">
                    <td className="px-6 py-4 text-ocean-base">
                      {format(new Date(tx.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.type === 'income'
                            ? 'bg-green-100 text-green-700'
                            : tx.type === 'expense'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ocean-base">{tx.category}</td>
                    <td className="px-6 py-4 text-ocean-base">{tx.description || '-'}</td>
                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(tx)
                            setShowForm(true)
                          }}
                          className="px-3 py-1 bg-ocean-pale/20 text-ocean-base rounded text-xs font-medium hover:bg-teal-light/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="p-12 text-center text-ocean-base">
                <p>No transactions found</p>
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <TransactionForm
            transaction={selectedTransaction}
            onClose={() => {
              setShowForm(false)
              setSelectedTransaction(null)
            }}
            onSave={() => {
              fetchData()
              setShowForm(false)
              setSelectedTransaction(null)
            }}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
          />
        )}
      </div>
    </div>
  )
}

function TransactionForm({
  transaction,
  onClose,
  onSave,
  incomeCategories,
  expenseCategories,
}: {
  transaction?: FinanceTransaction | null
  onClose: () => void
  onSave: () => void
  incomeCategories: string[]
  expenseCategories: string[]
}) {
  const [type, setType] = useState<FinanceTransaction['type']>(transaction?.type || 'expense')
  const [date, setDate] = useState(transaction?.date || format(new Date(), 'yyyy-MM-dd'))
  const [category, setCategory] = useState(transaction?.category || '')
  const [amount, setAmount] = useState(transaction?.amount.toString() || '')
  const [description, setDescription] = useState(transaction?.description || '')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer' | 'upi'>(transaction?.paymentMethod || 'cash')
  const [tags, setTags] = useState(transaction?.tags.join(', ') || '')
  const [saving, setSaving] = useState(false)

  const categories = type === 'income' ? incomeCategories : expenseCategories

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const txData = {
        date,
        type,
        category,
        amount: parseFloat(amount),
        description: description || undefined,
        paymentMethod,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      }

      const url = transaction ? `/api/admin/planner/finances/${transaction.id}` : '/api/admin/planner/finances'
      const method = transaction ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txData),
      })

      const data = await response.json()

      if (data.success) {
        onSave()
      } else {
        alert(data.message || 'Failed to save transaction')
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('Failed to save transaction')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl text-ocean-deep">
            {transaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-ocean-light hover:text-ocean-deep transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Type *</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as FinanceTransaction['type'])
                  setCategory('')
                }}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ocean-deep mb-2">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this transaction for?"
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                const value = e.target.value as 'cash' | 'card' | 'bank_transfer' | 'upi'
                if (value) setPaymentMethod(value)
              }}
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ocean-deep mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="groceries, monthly, etc..."
              className="w-full px-4 py-2 rounded-lg border border-ocean-light bg-neutral-white text-ocean-deep focus:outline-none focus:ring-2 focus:ring-teal-base"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-teal-base text-neutral-white rounded-lg font-medium hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : transaction ? 'Update Transaction' : 'Add Transaction'}
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


