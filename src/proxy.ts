import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const ADMIN_EMAILS = [
    "employee.vaporaura@gmail.com",
    "admin@vaporaura.com",
];

export function proxy(request: NextRequest) {
  console.log('proxy hit:', request.nextUrl.pathname)

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next()

    const sessionCookie = request.cookies.get('va_session')?.value

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const session = JSON.parse(sessionCookie)

      if (!session.accessToken || Date.now() > session.expiresAt) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (!ADMIN_EMAILS.includes(session.customer?.email?.toLowerCase())) {
        return NextResponse.redirect(new URL('/forbidden', request.url))
      }

      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}