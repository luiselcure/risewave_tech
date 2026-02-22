import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyRole } from '@/lib/auth';

// ----------------------------------------------------------------------
// GET - List all users (Protected: 'master' only)
// ----------------------------------------------------------------------
const getUsersHandler = async (req) => {
  try {
    await connectDB();
    
    // Explicitly exclude passwords from results
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { message: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
};

// ----------------------------------------------------------------------
// PATCH - Update User Role or Reset Password (Protected: 'master' only)
// ----------------------------------------------------------------------
const updateRoleHandler = async (req) => {
  try {
    const { userId, newRole, action } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: 'Datos incompletos.' }, { status: 400 });
    }

    await connectDB();

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    // Protection rule 1: A master cannot degrade themselves
    if (targetUser.email === req.user.email || targetUser._id.toString() === req.user.userId) {
      return NextResponse.json(
        { message: 'No puedes modificar tu propia cuenta por seguridad.' },
        { status: 403 }
      );
    }

    // Protection rule 2: Another master cannot be touched by a master 
    if (targetUser.role === 'master') {
       return NextResponse.json(
        { message: 'Operación denegada sobre otro administrador Maestro.' },
        { status: 403 }
      );
    }

    if (action === 'reset_password') {
      // Logic for random secure password reset
      // In a real scenario, this emails the user a temporary password.
      // Here we will set a default 'Temporal123!' but they should change it.
      const bcrypt = require('bcryptjs'); // Must require here or at top
      const salt = await bcrypt.genSalt(10);
      targetUser.password = await bcrypt.hash('Temporal123!', salt);
      await targetUser.save();

      return NextResponse.json(
        { message: `Contraseña de ${targetUser.email} ha sido reseteada a 'Temporal123!'` },
        { status: 200 }
      );
    }

    if (newRole) {
      if (!['user', 'admin', 'master'].includes(newRole)) {
        return NextResponse.json({ message: 'Rol inválido.' }, { status: 400 });
      }
      targetUser.role = newRole;
      await targetUser.save();
      return NextResponse.json(
        { message: `Rol de ${targetUser.email} actualizado a ${newRole}.` },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: 'Ninguna acción válida detectada.' }, { status: 400 });

  } catch (error) {
    console.error('Update role/password error:', error);
    return NextResponse.json(
      { message: 'Error en el servidor al procesar solicitud' },
      { status: 500 }
    );
  }
};

// ----------------------------------------------------------------------
// DELETE - Remove User Account (Protected: 'master' only)
// ----------------------------------------------------------------------
const deleteUserHandler = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'ID de usuario requerido.' }, { status: 400 });
    }

    await connectDB();
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    if (targetUser.role === 'master' || targetUser.email === req.user.email) {
      return NextResponse.json(
        { message: 'No se puede eliminar una cuenta Master o a ti mismo.' },
        { status: 403 }
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: 'Usuario eliminado del sistema.' }, { status: 200 });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { message: 'Error interno al intentar borrar cuenta' },
      { status: 500 }
    );
  }
};

// Both operations require exactly the 'master' role
export const GET = verifyRole(['master'], getUsersHandler);
export const PATCH = verifyRole(['master'], updateRoleHandler);
export const DELETE = verifyRole(['master'], deleteUserHandler);
