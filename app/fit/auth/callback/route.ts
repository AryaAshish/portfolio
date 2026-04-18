import { NextRequest, NextResponse } from 'next/server'
import { createFitPublicRouteClient } from '@/lib/fit-public/client-route'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')

  if (code) {
    const supabase = createFitPublicRouteClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  const url = req.nextUrl.clone()
  url.pathname = '/fit'
  url.search = ''
  return NextResponse.redirect(url)
}
