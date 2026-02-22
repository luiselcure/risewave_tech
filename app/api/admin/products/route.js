import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { verifyRole } from '@/lib/auth';

// ----------------------------------------------------------------------
// GET - List all products for admin (Protected: 'admin', 'master')
// Includes hidden products
// ----------------------------------------------------------------------
const getAdminProductsHandler = async (req) => {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Get admin products error:', error);
    return NextResponse.json(
      { message: 'Error al obtener productos' },
      { status: 500 }
    );
  }
};

export const GET = verifyRole(['admin', 'master'], getAdminProductsHandler);
