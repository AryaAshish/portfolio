import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Meals' }

export default function MealsPage() {
  return (
    <div>
      <p className="text-[11px] font-semibold text-[#999] uppercase tracking-widest mb-1">
        Meals
      </p>
      <h1 className="font-grotesk text-2xl font-bold text-[#1a1a1a] mb-6">
        Meal Log
      </h1>
      <div className="bg-white border border-[#e8e8e4] rounded-[10px] p-8 text-center text-[#999] text-sm">
        Phase 7 — coming soon
      </div>
    </div>
  )
}
