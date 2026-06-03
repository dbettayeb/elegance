import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Guard Admin ──
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('admin_session')?.value
    if (session !== process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // ── Guard Portail Mariés ──
  if (pathname.startsWith('/couple')) {
    const segments = pathname.split('/')
    const slug = segments[2]
    if (slug && !pathname.endsWith('/login')) {
      const coupleSession = request.cookies.get(`couple_${slug}`)?.value
      if (!coupleSession) {
        return NextResponse.redirect(
          new URL(`/couple/${slug}/login`, request.url)
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/((?!login).*)',
    '/couple/:slug/:path*',
  ],
}