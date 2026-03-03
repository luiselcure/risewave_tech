import { NextResponse } from 'next/server';

export function middleware(request) {
  // Obtenemos la cookie 'token' verificada desde el endpoint de login
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
