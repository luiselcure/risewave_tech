import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that require 'admin' or 'master' role
const adminPaths = ['/admin'];
// Paths that require exclusively 'master' role
const masterOnlyPaths = ['/admin/master-only'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  const isMasterOnlyPath = masterOnlyPaths.some(path => pathname.startsWith(path));

  if (isAdminPath || isMasterOnlyPath) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development');
      const { payload } = await jwtVerify(token, secret);
      
      const role = payload.role;

      // Master check
      if (isMasterOnlyPath && role !== 'master') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Admin check (master also passes)
      if (isAdminPath && !isMasterOnlyPath && !['admin', 'master'].includes(role)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
