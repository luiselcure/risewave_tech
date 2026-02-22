import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyRole } from '@/lib/auth';
import { userProfileUpdateSchema } from '@/lib/validations/userSchema';

// ----------------------------------------------------------------------
// PATCH - Update User Profile (Self)
// ----------------------------------------------------------------------
const updateProfileHandler = async (req) => {
  try {
    const body = await req.json();

    const validationResult = userProfileUpdateSchema.safeParse(body);
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

    const { telefono, direccion } = validationResult.data;
    const userId = req.user.userId; // Provided by verifyRole

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { telefono, direccion },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response

    if (!updatedUser) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Perfil actualizado exitosamente', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al actualizar perfil' },
      { status: 500 }
    );
  }
};

// Available to all logged-in users regardless of rank
export const PATCH = verifyRole(['user', 'admin', 'master'], updateProfileHandler);
