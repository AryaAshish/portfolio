import type { Metadata } from 'next'
import { getPlanPhases } from '@/lib/fittrack-supabase'
import { PhaseEditor } from '../_components/PhaseEditor'
import { BackLink } from '../_components/BackLink'
import { FT } from '../_components/tokens'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Plan' }

export default async function PlanPage() {
  const phases = await getPlanPhases()

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-4 px-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: FT.textPrimary }}>
          Training phases
        </h1>
        <BackLink label="← Back" />
      </div>

      <p className="text-xs" style={{ color: FT.textSecondary }}>
        Set the start and end date of each phase. The Today page shows Day N out of the total
        length of the plan, and highlights the phase containing today.
      </p>

      <PhaseEditor initial={phases} />
    </div>
  )
}
