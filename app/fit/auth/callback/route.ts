import { NextRequest, NextResponse } from 'next/server'
import { createFitPublicRouteClient } from '@/lib/fit-public/client-route'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error_description') || searchParams.get('error')

  if (errorParam) {
    const url = req.nextUrl.clone()
    url.pathname = '/fit/login'
    url.search = `?error=${encodeURIComponent(errorParam)}`
    return NextResponse.redirect(url)
  }

  const type = searchParams.get('type')

  if (code) {
    const supabase = createFitPublicRouteClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      const url = req.nextUrl.clone()
      url.pathname = '/fit/login'
      url.search = `?error=${encodeURIComponent(error.message)}`
      return NextResponse.redirect(url)
    }

    if (type === 'recovery') {
      const url = req.nextUrl.clone()
      url.pathname = '/fit/reset-password'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  const url = req.nextUrl.clone()
  url.pathname = '/fit'
  url.search = ''
  return NextResponse.redirect(url)
}
