import { NextResponse } from 'next/server'
import { createFitPublicRouteClient } from '@/lib/fit-public/client-route'
import { fetchAllFitTrackRows } from '@/lib/fit-public/data'
import { composeSnapshot, snapshotFilename } from '@/lib/fittrack/export-snapshot'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const client = createFitPublicRouteClient()
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
      return NextResponse.json({ ok: false, message: 'Not authenticated' }, { status: 401 })
    }

    const rows = await fetchAllFitTrackRows(client)
    const exportedAt = new Date().toISOString()
    const snapshot = composeSnapshot(rows, exportedAt)

    return new NextResponse(JSON.stringify(snapshot, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${snapshotFilename(exportedAt)}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Export failed'
    return NextResponse.json({ ok: false, message }, { status: 500 })
  }
}
