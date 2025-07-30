import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the access token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/profile', '/orders'];
  
  // Check if the current path requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !accessToken) {
    // Redirect to login page if not authenticated
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/orders/:path*']
};
