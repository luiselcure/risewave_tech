import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { verifyRole } from '@/lib/auth';

// ----------------------------------------------------------------------
// PATCH - Update product status/visibility (Protected: 'admin', 'master')
// ----------------------------------------------------------------------
const updateProductHandler = async (req, context) => {
  try {
    const params = await context.params;
    const { id } = params;
    const body = await req.json();

    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    }

    if (body.estado !== undefined) product.estado = body.estado;
    if (body.visible !== undefined) product.visible = body.visible;

    await product.save();

    return NextResponse.json(
      { message: 'Producto actualizado exitosamente', product },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { message: 'Error en el servidor al actualizar producto' },
      { status: 500 }
    );
  }
};

export const PATCH = verifyRole(['admin', 'master'], updateProductHandler);
