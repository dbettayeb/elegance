import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!request.cookies.get('admin_session')?.value) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/couple/') && !pathname.endsWith('/login')) {
    const slug = pathname.split('/')[2]
    if (slug && !request.cookies.get(`couple_${slug}`)?.value) {
      const url = request.nextUrl.clone()
      url.pathname = `/couple/${slug}/login`
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/couple/:path*'],
}
