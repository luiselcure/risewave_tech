import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyRole } from '@/lib/auth';
import { userPasswordUpdateSchema } from '@/lib/validations/userSchema';
import bcrypt from 'bcryptjs';

// ----------------------------------------------------------------------
// PATCH - Change Password (Self)
// ----------------------------------------------------------------------
const changePasswordHandler = async (req) => {
  try {
    const body = await req.json();

    const validationResult = userPasswordUpdateSchema.safeParse(body);
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

    const { newPassword } = validationResult.data;
    const userId = req.user.userId; // Provided by verifyRole

    await connectDB();

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Encrypt the new password
    const salt = await bcrypt.genSalt(10);
    currentUser.password = await bcrypt.hash(newPassword, salt);
    
    await currentUser.save();

    return NextResponse.json(
      { message: 'Contraseña actualizada correctamente.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al cambiar contraseña' },
      { status: 500 }
    );
  }
};

// Available to all logged-in users
export const PATCH = verifyRole(['user', 'admin', 'master'], changePasswordHandler);
