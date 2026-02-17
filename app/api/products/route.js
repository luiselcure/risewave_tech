import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    await dbConnect();

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
        success: true,
        count: products.length,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}
