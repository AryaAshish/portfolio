import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWorkoutById, getExerciseLogsForWorkout } from '@/lib/fittrack-supabase'
import { FT } from '../../../_components/tokens'
import { WorkoutEditForm } from '../../../_components/WorkoutEditForm'

export const dynamic = 'force-dynamic'

export default async function EditWorkoutPage({
  params,
}: {
  params: { workoutId: string }
}) {
  const workout = await getWorkoutById(params.workoutId)
  if (!workout) notFound()

  const logs = await getExerciseLogsForWorkout(workout.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/fittrack/train"
          className="text-xs"
          style={{ color: FT.textMuted }}
        >
          ← Train
        </Link>
        <p className="text-xs" style={{ color: FT.textMuted }}>
          {workout.date}
        </p>
      </div>

      <div>
        <h1 className="font-grotesk text-xl font-semibold" style={{ color: FT.textPrimary }}>
          Edit workout
        </h1>
        <p className="text-xs mt-0.5" style={{ color: FT.textMuted }}>
          Change title, day type, sets, or delete this session.
        </p>
      </div>

      <WorkoutEditForm workout={workout} logs={logs} />
    </div>
  )
}
