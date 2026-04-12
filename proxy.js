import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('admin_auth');
  
  console.log(`[PROXY] Request: ${pathname}, AuthCookie: ${authCookie?.value || 'none'}`);
  
  if (pathname.startsWith('/admin')) {
    if (!authCookie || authCookie.value !== 'true') {
      console.log(`[PROXY] Redirecting to /login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
