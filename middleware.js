import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const adminAuth = request.cookies.get('admin_auth');
  const userSession = request.cookies.get('user_session');

  // Protect admin routes → redirect to /login
  if (pathname.startsWith('/admin')) {
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect customer routes → redirect to /user-login
  if (pathname.startsWith('/home') || pathname.startsWith('/catalog')) {
    if (!userSession) {
      return NextResponse.redirect(new URL('/user-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/home/:path*', '/catalog/:path*'],
};
