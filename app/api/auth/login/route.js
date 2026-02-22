import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { userLoginSchema } from '@/lib/validations/userSchema';

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const validationResult = userLoginSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      return NextResponse.json(
        { message: 'Error de validación', errors },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    await connectDB();

    // Find user by email and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save({ validateModifiedOnly: true });

    // Generate JWT token including role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_for_development',
      { expiresIn: '7d' }
    );

    // Create the response
    const response = NextResponse.json(
      {
        message: 'Login exitoso',
        user: {
          id: user._id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          role: user.role,
          telefono: user.telefono,
          direccion: user.direccion,
        },
      },
      { status: 200 }
    );

    // Set HttpOnly cookie for auth
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Error en el servidor al procesar el login' },
      { status: 500 }
    );
  }
}
