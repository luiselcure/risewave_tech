import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { verifyRole } from '@/lib/auth';
import { productSchema } from '@/lib/validations/productSchema';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');

    // Build query
    const query = {};
    if (categoria && categoria !== 'all') {
      query.categoria = categoria;
    }

    // Fetch products
    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        count: products.length,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { message: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// POST - Create new product (Protected: Only 'admin' or 'master')
// ----------------------------------------------------------------------
const createProductHandler = async (req) => {
  try {
    const body = await req.json();

    // 1. Validate payload with Zod
    const validationResult = productSchema.safeParse(body);
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

    const productData = validationResult.data;

    await connectDB();

    const newProduct = await Product.create({
      ...productData,
      // Record who created this product using the injected user payload from verifyRole
      createdBy: req.user.email,
    });

    return NextResponse.json(
      {
        message: 'Producto creado exitosamente',
        product: newProduct
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { message: 'Error en el servidor al crear producto' },
      { status: 500 }
    );
  }
};

export const POST = verifyRole(['admin', 'master'], createProductHandler);
