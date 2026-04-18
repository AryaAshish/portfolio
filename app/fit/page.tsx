import { FT } from '@/app/fittrack/_components/tokens'

export const dynamic = 'force-dynamic'

export default function FitOverviewPage() {
  return (
    <div className="space-y-5">
      <div
        className="rounded-xl p-4 text-center"
        style={{ background: FT.surface, border: `1px solid ${FT.border}` }}
      >
        <p className="text-sm" style={{ color: FT.textSecondary }}>
          Welcome to FitTrack! Start logging your workouts and meals.
        </p>
      </div>
    </div>
  )
}
