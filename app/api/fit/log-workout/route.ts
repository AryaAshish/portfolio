import { NextRequest, NextResponse } from 'next/server'
import { createFitPublicRouteClient } from '@/lib/fit-public/client-route'
import { ingestMotraWorkoutPublic } from '@/lib/fit-public/ingest-motra'

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status })
}

export async function POST(req: NextRequest) {
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
  const client = createFitPublicRouteClient()

  try {
    const { workoutId } = await ingestMotraWorkoutPublic(client, text)
    return json({ ok: true, workoutId }, 200)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const isParseError = msg.startsWith('No sets') || msg.includes('Could not') || msg.includes('parse') || msg.includes('Parse')
    if (isParseError) {
      return json({ ok: false, code: 'PARSE_ERROR', message: msg }, 400)
    }
    return json({ ok: false, code: 'DB_ERROR', message: 'Failed to save workout' }, 500)
  }
}
