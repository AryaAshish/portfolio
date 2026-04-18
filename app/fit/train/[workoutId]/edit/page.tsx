import { notFound } from 'next/navigation'
import { createFitPublicServerClient } from '@/lib/fit-public/client-server'
import { getWorkoutById, getExerciseLogsForWorkout } from '@/lib/fit-public/data'
import { FT } from '@/app/fittrack/_components/tokens'
import { WorkoutEditFormPublic } from '@/app/fit/_components/WorkoutEditFormPublic'
import { BackLink } from '@/app/fittrack/_components/BackLink'

export const dynamic = 'force-dynamic'

export default async function FitEditWorkoutPage({
  params,
}: {
  params: { workoutId: string }
}) {
  const client = createFitPublicServerClient()
  const workout = await getWorkoutById(client, params.workoutId)
  if (!workout) notFound()

  const logs = await getExerciseLogsForWorkout(client, workout.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <BackLink />
        <p className="text-xs" style={{ color: FT.textMuted }}>{workout.date}</p>
      </div>
      <div>
        <h1 className="font-grotesk text-xl font-semibold" style={{ color: FT.textPrimary }}>Edit workout</h1>
        <p className="text-xs mt-0.5" style={{ color: FT.textMuted }}>Change title, day type, sets, or delete this session.</p>
      </div>
      <WorkoutEditFormPublic workout={workout} logs={logs} />
    </div>
  )
}
