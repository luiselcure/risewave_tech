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
// PATCH - Update User Role (Protected: 'master' only)
// ----------------------------------------------------------------------
const updateRoleHandler = async (req) => {
  try {
    const { userId, newRole } = await req.json();

    if (!userId || !newRole) {
      return NextResponse.json({ message: 'Datos incompletos.' }, { status: 400 });
    }

    // Basic role validation over enum
    if (!['user', 'admin', 'master'].includes(newRole)) {
      return NextResponse.json({ message: 'Rol inválido.' }, { status: 400 });
    }

    await connectDB();

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    // Protection rule 1: A master cannot degrade themselves
    if (targetUser.email === req.user.email || targetUser._id.toString() === req.user.userId) {
      return NextResponse.json(
        { message: 'No puedes modificar tu propio rol por seguridad.' },
        { status: 403 }
      );
    }

    // Protection rule 2: Another master cannot be degraded by a master 
    // (Depending on business logic, usually master is peer-to-peer or singular. 
    // Here we prevent touching another master to be safe).
    if (targetUser.role === 'master') {
       return NextResponse.json(
        { message: 'No puedes modificar el rol de otro administrador Maestro.' },
        { status: 403 }
      );
    }

    targetUser.role = newRole;
    await targetUser.save();

    return NextResponse.json(
      { message: `Rol de ${targetUser.email} actualizado a ${newRole}.` },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update role error:', error);
    return NextResponse.json(
      { message: 'Error en el servidor al actualizar rol' },
      { status: 500 }
    );
  }
};

// Both operations require exactly the 'master' role
export const GET = verifyRole(['master'], getUsersHandler);
export const PATCH = verifyRole(['master'], updateRoleHandler);
