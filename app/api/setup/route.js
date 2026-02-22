import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await connectDB();

    // Check if any master user exists
    const masterExists = await User.findOne({ role: 'master' });

    if (masterExists) {
      return NextResponse.json(
        { message: 'El sistema ya fue inicializado con un usuario Master.' },
        { status: 403 }
      );
    }

    const masterEmail = process.env.ADMIN_EMAIL;
    const masterPassword = process.env.ADMIN_PASSWORD;

    if (!masterEmail || !masterPassword) {
      return NextResponse.json(
        { message: 'Configuración incompleta: Faltan ADMIN_EMAIL o ADMIN_PASSWORD en las variables de entorno.' },
        { status: 500 }
      );
    }

    // Hash the password directly here because User.create triggers the pre-save hook,
    // which hashes it, but we can also rely on the model hook. Let's use the model's hook cleanly.
    
    const newMaster = await User.create({
      nombre: 'Master',
      apellido: 'Admin',
      email: masterEmail,
      telefono: '0000000000',
      password: masterPassword, // Will be hashed by pre-save hook
      direccion: {
        calle: 'Central Command',
        altura: '1',
        ciudad: 'Cyber City',
        codigoPostal: '0000'
      },
      role: 'master',
      createdBy: 'system_bootstrap'
    });

    return NextResponse.json(
      { 
        message: 'Usuario Master inicializado exitosamente.',
        email: newMaster.email 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Bootstrap error:', error);
    return NextResponse.json(
      { message: 'Error en el servidor durante el bootstrap.' },
      { status: 500 }
    );
  }
}
