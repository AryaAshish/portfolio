import type { ExerciseLog, Workout } from '@/lib/fittrack-supabase'

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

export type ParsedExerciseRow = Omit<
  ExerciseLog,
  'id' | 'created_at' | 'workout_id'
>

export type ParsedMotraWorkout = {
  title: string
  date: string
  durationMins: number | null
  volumeKg: number | null
  caloriesBurned: number | null
  workoutType: Workout['type']
  exerciseLogs: ParsedExerciseRow[]
  exercisesSummary: Record<string, unknown> | null
  motraRaw: Record<string, unknown>
}

function inferWorkoutType(title: string): Workout['type'] {
  const t = title.toLowerCase()
  if (/\bpush\b/.test(t)) return 'push'
  if (/\bpull\b/.test(t)) return 'pull'
  if (/\blegs?\b|\blower\s*body\b|\bsquat\b|\bhamstring\b|\bglute\b/.test(t)) return 'legs'
  if (/\bcardio\b|\bbadminton\b|\brunning\b|\bcycling\b|\bswimming\b|\bhiit\b|\btreadmill\b/.test(t)) return 'cardio'
  if (/\brest\b/.test(t)) return 'rest'
  if (/\bchest\b|\bbench\b|\bshoulder\b|\btricep\b|\bupper\s*body\b/.test(t)) return 'push'
  if (/\bback\b|\bbicep\b|\brow\b|\bdeadlift\b/.test(t)) return 'pull'
  if (/\bfull\s*body\b|\bstrength\b|\bcompound\b/.test(t)) return 'push'
  return 'auxiliary'
}

function parseDateLine(line: string): string | null {
  const m = line.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/)
  if (!m) return null
  const d = parseInt(m[1], 10)
  const mon = MONTHS[m[2]]
  if (mon === undefined) return null
  const y = parseInt(m[3], 10)
  const mm = String(mon + 1).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

function parseDurationMins(line: string): number | null {
  const m = line.match(/Duration:\s*(.+)$/i)
  if (!m) return null
  const s = m[1]
  const hm = s.match(/(\d+)\s*h\s*(\d+)\s*m/i)
  if (hm) return parseInt(hm[1], 10) * 60 + parseInt(hm[2], 10)
  const mOnly = s.match(/(\d+)\s*m\b/i)
  if (mOnly) return parseInt(mOnly[1], 10)
  return null
}

function parseVolumeKg(line: string): number | null {
  const m = line.match(/Volume:\s*(.+)$/i)
  if (!m) return null
  const s = m[1].trim()
  const k = s.match(/([\d.]+)\s*K\s*kg/i)
  if (k) return Math.round(parseFloat(k[1]) * 1000 * 100) / 100
  const plain = s.match(/([\d,.]+)\s*kg/i)
  if (plain) return parseFloat(plain[1].replace(/,/g, ''))
  return null
}

function parseCalories(line: string): number | null {
  const m = line.match(/Calories:\s*(\d+)/i)
  return m ? parseInt(m[1], 10) : null
}

function parseSetLine(
  line: string,
  date: string,
  exerciseName: string
): ParsedExerciseRow | null {
  const warm = line.match(/^Warm\s*Up:\s*(\d+)\s*reps?\s*x\s*([\d.]+)\s*kg/i)
  if (warm) {
    return {
      date,
      exercise_name: exerciseName,
      set_number: null,
      set_type: 'warmup',
      reps: parseInt(warm[1], 10),
      weight_kg: parseFloat(warm[2]),
      duration_secs: null,
    }
  }
  const drop = line.match(/^Drop\s*Set:\s*(\d+)\s*reps?\s*x\s*([\d.]+)\s*kg/i)
  if (drop) {
    return {
      date,
      exercise_name: exerciseName,
      set_number: null,
      set_type: 'dropset',
      reps: parseInt(drop[1], 10),
      weight_kg: parseFloat(drop[2]),
      duration_secs: null,
    }
  }
  const work = line.match(/^(\d+):\s*(\d+)\s*reps?\s*x\s*([\d.]+)\s*kg/i)
  if (work) {
    return {
      date,
      exercise_name: exerciseName,
      set_number: parseInt(work[1], 10),
      set_type: 'working',
      reps: parseInt(work[2], 10),
      weight_kg: parseFloat(work[3]),
      duration_secs: null,
    }
  }
  const cardio = line.match(/^(\d+):\s*(\d{1,2}):(\d{2})\s*$/i)
  if (cardio) {
    const mins = parseInt(cardio[2], 10)
    const secs = parseInt(cardio[3], 10)
    return {
      date,
      exercise_name: exerciseName,
      set_number: parseInt(cardio[1], 10),
      set_type: 'cardio',
      reps: null,
      weight_kg: null,
      duration_secs: mins * 60 + secs,
    }
  }
  return null
}

function findTitle(lines: string[]): string {
  for (const line of lines) {
    if (!line) continue
    if (/^my workout:?$/i.test(line)) continue
    if (/^tracked with motra/i.test(line)) continue
    if (/^https?:\/\//i.test(line)) continue
    if (/^\d{1,2}\s+\w{3}\s+\d{4}/.test(line)) continue
    if (/^duration:/i.test(line)) continue
    if (/^volume:/i.test(line)) continue
    if (/^calories:/i.test(line)) continue
    if (/^exercises?:/i.test(line)) continue
    return line
  }
  return 'Workout'
}

export function parseMotraShareText(raw: string): ParsedMotraWorkout {
  const text = raw.replace(/\r\n/g, '\n').trim()
  if (!text) throw new Error('Empty Motra text')

  const lines = text.split('\n').map((l) => l.trim())
  const title = findTitle(lines)

  let dateStr: string | null = null
  let durationMins: number | null = null
  let volumeKg: number | null = null
  let caloriesBurned: number | null = null

  for (const line of lines) {
    if (!dateStr) {
      const d = parseDateLine(line)
      if (d) dateStr = d
    }
    if (durationMins === null) durationMins = parseDurationMins(line)
    if (volumeKg === null) volumeKg = parseVolumeKg(line)
    if (caloriesBurned === null) caloriesBurned = parseCalories(line)
  }

  if (!dateStr) throw new Error('Could not parse workout date')

  const exerciseLogs: ParsedExerciseRow[] = []
  const exIdx = lines.findIndex((l) => /^exercises:/i.test(l))
  if (exIdx < 0) throw new Error('Could not find Exercises block')

  let currentExercise: string | null = null
  for (let i = exIdx + 1; i < lines.length; i++) {
    const line = lines[i]
    if (/^tracked with motra/i.test(line)) break

    if (line === '') {
      currentExercise = null
      continue
    }

    const setRow = currentExercise ? parseSetLine(line, dateStr, currentExercise) : null
    if (setRow) {
      exerciseLogs.push(setRow)
      continue
    }

    if (
      !/^duration:/i.test(line) &&
      !/^volume:/i.test(line) &&
      !/^calories:/i.test(line) &&
      !/^exercises:/i.test(line)
    ) {
      currentExercise = line
    }
  }

  const workoutType = inferWorkoutType(title)
  const exercisesSummary =
    exerciseLogs.length > 0
      ? {
          exerciseCount: new Set(exerciseLogs.map((e) => e.exercise_name)).size,
          setCount: exerciseLogs.length,
        }
      : null

  return {
    title,
    date: dateStr,
    durationMins,
    volumeKg,
    caloriesBurned,
    workoutType,
    exerciseLogs,
    exercisesSummary,
    motraRaw: { raw: text },
  }
}
