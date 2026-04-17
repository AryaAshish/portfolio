import { NextResponse } from 'next/server'
import { fetchAllFitTrackRows } from '@/lib/fittrack-supabase'
import { composeSnapshot, snapshotFilename } from '@/lib/fittrack/export-snapshot'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const rows = await fetchAllFitTrackRows()
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
