import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const { nombre, apellido, email, telefono, password, confirmPassword, direccion } = await request.json();

    // Validation: Check all required fields
    if (!nombre || !apellido || !email || !telefono || !password || !confirmPassword || !direccion) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Validation: Password requirements
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'La contraseña debe tener al menos 8 caracteres, incluir al menos 1 número y 1 carácter especial' 
        },
        { status: 400 }
      );
    }

    // Validation: Password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Las contraseñas no coinciden' },
        { status: 400 }
      );
    }

    // Validation: Address fields
    if (!direccion.calle || !direccion.altura || !direccion.ciudad || !direccion.codigoPostal) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos de dirección son obligatorios' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      nombre,
      apellido,
      email,
      telefono,
      password,
      direccion,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: user._id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
