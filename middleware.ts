import { NextRequest, NextResponse } from 'next/server'
import { verifyCookie } from '@/lib/auth/cookie'
import { createFitPublicMiddlewareClient } from '@/lib/fit-public/client-middleware'

const ADMIN_PUBLIC_PATHS = new Set([
  '/admin/login',
  '/api/admin/auth',
  '/api/admin/logout',
])

const FITTRACK_API_PUBLIC_PATHS = new Set([
  '/api/fittrack/log-workout',
  '/api/fittrack/logout',
])

const FIT_PUBLIC_PATHS = new Set([
  '/fit/login',
  '/fit/signup',
  '/fit/forgot-password',
  '/fit/reset-password',
  '/fit/auth/callback',
])

const FIT_API_PUBLIC_PREFIXES = ['/api/fit/auth/']
const FIT_API_PUBLIC_PATHS = new Set(['/api/fit/default-landing'])

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/fittrack')) {
    const session = await verifyCookie(req.cookies.get('ft_session')?.value)
    if (!session || session.role !== 'fittrack') {
      return new NextResponse(null, { status: 404 })
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/fittrack/')) {
    if (FITTRACK_API_PUBLIC_PATHS.has(pathname)) return NextResponse.next()
    const session = await verifyCookie(req.cookies.get('ft_session')?.value)
    if (!session || session.role !== 'fittrack') {
      return new NextResponse(null, { status: 401 })
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/fit')) {
    if (FIT_PUBLIC_PATHS.has(pathname)) {
      const response = NextResponse.next()
      response.headers.set('x-fit-pathname', pathname)
      const client = createFitPublicMiddlewareClient(req, response)
      if (client) {
        const { data: { user } } = await client.auth.getUser()
        if (user && (pathname === '/fit/login' || pathname === '/fit/signup')) {
          const url = req.nextUrl.clone()
          url.pathname = '/fit'
          url.search = ''
          return NextResponse.redirect(url)
        }
      }
      return response
    }

    const response = NextResponse.next()
    response.headers.set('x-fit-pathname', pathname)
    const client = createFitPublicMiddlewareClient(req, response)
    if (!client) {
      return new NextResponse(null, { status: 404 })
    }
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
      const url = req.nextUrl.clone()
      url.pathname = '/fit/login'
      url.search = ''
      return NextResponse.redirect(url)
    }
    return response
  }

  if (pathname.startsWith('/api/fit/')) {
    if (
      FIT_API_PUBLIC_PATHS.has(pathname) ||
      FIT_API_PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
    ) {
      return NextResponse.next()
    }
    const response = NextResponse.next()
    const client = createFitPublicMiddlewareClient(req, response)
    if (!client) {
      return new NextResponse(null, { status: 401 })
    }
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
      return new NextResponse(null, { status: 401 })
    }
    return response
  }

  if (ADMIN_PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const session = await verifyCookie(req.cookies.get('admin_session')?.value)
    if (!session || session.role !== 'admin') {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = ''
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/admin/')) {
    const session = await verifyCookie(req.cookies.get('admin_session')?.value)
    if (!session || session.role !== 'admin') {
      return new NextResponse(null, { status: 401 })
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/fittrack',
    '/fittrack/:path*',
    '/fit',
    '/fit/:path*',
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/fittrack/:path*',
    '/api/fit/:path*',
  ],
}
