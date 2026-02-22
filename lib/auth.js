import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

// Helper to verify Edge JWT (jose is used because jsonwebtoken doesn't run on Edge runtime natively)
export async function verifyAuthToken(req) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value || req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development');
    const { payload } = await jose.jwtVerify(token, secret);
    return payload; // { userId, role, iat, exp }
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return null;
  }
}

// Server-Side Higher Order Function for API route protection
export function verifyRole(allowedRoles, handler) {
  return async (req, ...args) => {
    try {
      const payload = await verifyAuthToken(req);

      if (!payload) {
        return NextResponse.json(
          { message: 'No autorizado. Token no válido o ausente.' },
          { status: 401 }
        );
      }

      // If user role is not in the allowed roles array, reject
      if (!allowedRoles.includes(payload.role)) {
        return NextResponse.json(
          { message: 'Prohibido. Rango insuficiente para acceder a este recurso.' },
          { status: 403 }
        );
      }

      // Inject user payload into request for the handler to use
      req.user = payload;

      // Proceed to the actual handler
      return handler(req, ...args);

    } catch (error) {
      console.error('Error in verifyRole HOF:', error);
      return NextResponse.json(
        { message: 'Error interno de validación de permisos.' },
        { status: 500 }
      );
    }
  };
}
