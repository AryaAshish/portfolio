import { NextRequest, NextResponse } from 'next/server'
import { ingestMotraWorkout } from '@/lib/fittrack/ingest-motra'

function json(
  body: Record<string, unknown>,
  status: number
) {
  return NextResponse.json(body, { status })
}

export async function POST(req: NextRequest) {
  const secret = process.env.FITTRACK_INGEST_SECRET
  const auth = req.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return json(
      { ok: false, code: 'UNAUTHORIZED', message: 'Invalid or missing authorization' },
      401
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ ok: false, code: 'BAD_REQUEST', message: 'Invalid JSON body' }, 400)
  }

  if (
    !body ||
    typeof body !== 'object' ||
    typeof (body as { text?: unknown }).text !== 'string' ||
    !(body as { text: string }).text.trim()
  ) {
    return json({ ok: false, code: 'BAD_REQUEST', message: 'Missing text' }, 400)
  }

  const text = (body as { text: string }).text.trim()

  try {
    const { workoutId } = await ingestMotraWorkout(text)
    return json({ ok: true, workoutId }, 200)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.startsWith('No sets') || msg.includes('Could not')) {
      return json({ ok: false, code: 'PARSE_ERROR', message: msg }, 400)
    }
    return json({ ok: false, code: 'DB_ERROR', message: msg }, 500)
  }
}
