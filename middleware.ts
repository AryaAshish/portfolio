import { NextRequest, NextResponse } from 'next/server'
import { verifyCookie } from '@/lib/auth/cookie'

const ADMIN_PUBLIC_PATHS = new Set([
  '/admin/login',
  '/api/admin/auth',
  '/api/admin/logout',
])

const FITTRACK_API_PUBLIC_PATHS = new Set([
  '/api/fittrack/log-workout',
  '/api/fittrack/logout',
])

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
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/fittrack/:path*',
  ],
}
