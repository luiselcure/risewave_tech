import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { userRegisterSchema } from '@/lib/validations/userSchema';

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Zod / Schema Validation
    const validationResult = userRegisterSchema.safeParse(body);
    if (!validationResult.success) {
      // Debug para ver la estructura real del error
      console.error('Estructura de error de validación:', JSON.stringify(validationResult.error, null, 2));
      
      // Fallback robusto para buscar el array de errores
      const errorArray = validationResult.error?.errors || validationResult.error?.issues || (Array.isArray(validationResult.error) ? validationResult.error : []);
      
      const errors = errorArray.map(err => ({
        path: err.path ? err.path.join('.') : 'campo_desconocido',
        message: err.message || 'Error de validación'
      }));
      
      return NextResponse.json(
        { message: 'Error de validación en los datos ingresados', errors },
        { status: 400 }
      );
    }

    const { nombre, apellido, email, telefono, password, direccion } = validationResult.data;

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Create user (role defaults to 'user' in schema)
    const user = await User.create({
      nombre,
      apellido,
      email,
      telefono,
      password,
      direccion,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_for_development',
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
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
      { status: 201 }
    );

    // Set cookie
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Error en el servidor al registrar usuario' },
      { status: 500 }
    );
  }
}
