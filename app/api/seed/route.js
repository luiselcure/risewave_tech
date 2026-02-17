import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

// Sample product data
const sampleProducts = [
  // Artículos de Oficina (4)
  {
    titulo: 'Organizador de Escritorio Modular',
    descripcion: 'Organizador modular impreso en 3D con compartimentos ajustables para bolígrafos, clips y notas. Diseño minimalista y funcional.',
    precio: 2500,
    imagenUrl: '/products/organizador-escritorio.jpg',
    categoria: 'Artículos de Oficina',
    stock: 15,
  },
  {
    titulo: 'Soporte para Laptop Ergonómico',
    descripcion: 'Soporte elevado para laptop que mejora la postura y ventilación. Diseño plegable y portable.',
    precio: 3800,
    imagenUrl: '/products/soporte-laptop.jpg',
    categoria: 'Artículos de Oficina',
    stock: 12,
  },
  {
    titulo: 'Porta Cables Magnético',
    descripcion: 'Sistema magnético de gestión de cables para mantener tu escritorio ordenado. Incluye 5 clips.',
    precio: 1500,
    imagenUrl: '/products/porta-cables.jpg',
    categoria: 'Artículos de Oficina',
    stock: 25,
  },
  {
    titulo: 'Soporte para Monitor Dual',
    descripcion: 'Base elevadora para dos monitores con compartimento de almacenamiento integrado.',
    precio: 5200,
    imagenUrl: '/products/soporte-monitor.jpg',
    categoria: 'Artículos de Oficina',
    stock: 8,
  },
  
  // Gadgets Gaming (4)
  {
    titulo: 'Soporte para Auriculares RGB',
    descripcion: 'Soporte con diseño futurista y sistema de iluminación RGB personalizable. Base antideslizante.',
    precio: 3200,
    imagenUrl: '/products/soporte-auriculares.jpg',
    categoria: 'Gadgets Gaming',
    stock: 18,
  },
  {
    titulo: 'Empuñadura para Control Customizada',
    descripcion: 'Grips ergonómicos para controles de PS5/Xbox con textura antideslizante. Set de 2 unidades.',
    precio: 2800,
    imagenUrl: '/products/empuñadura-control.jpg',
    categoria: 'Gadgets Gaming',
    stock: 22,
  },
  {
    titulo: 'Figura de Acción Customizable',
    descripcion: 'Base de figura articulada para personalizar con tu propio diseño. Altura: 15cm.',
    precio: 4500,
    imagenUrl: '/products/figura-accion.jpg',
    categoria: 'Gadgets Gaming',
    stock: 10,
  },
  {
    titulo: 'Organizador de Cables Gaming',
    descripcion: 'Sistema de gestión de cables con diseño gamer y luces LED opcionales.',
    precio: 2200,
    imagenUrl: '/products/cables-gaming.jpg',
    categoria: 'Gadgets Gaming',
    stock: 20,
  },
  
  // Mejoras para el Hogar (4)
  {
    titulo: 'Macetero Geométrico Colgante',
    descripcion: 'Macetero con diseño geométrico moderno. Incluye sistema de drenaje y plato recolector.',
    precio: 1800,
    imagenUrl: '/products/macetero-geometrico.jpg',
    categoria: 'Mejoras para el Hogar',
    stock: 30,
  },
  {
    titulo: 'Lámpara de Mesa Minimalista',
    descripcion: 'Lámpara LED con brazo articulado y 3 niveles de intensidad. Diseño orgánico.',
    precio: 4800,
    imagenUrl: '/products/lampara-mesa.jpg',
    categoria: 'Mejoras para el Hogar',
    stock: 14,
  },
  {
    titulo: 'Perchero de Pared Modular',
    descripcion: 'Set de 6 ganchos modulares con diseño minimalista. Montaje fácil sin taladro.',
    precio: 2400,
    imagenUrl: '/products/perchero-modular.jpg',
    categoria: 'Mejoras para el Hogar',
    stock: 16,
  },
  {
    titulo: 'Reloj de Pared Personalizable',
    descripcion: 'Reloj de pared con marco impreso en 3D. Mecanismo silencioso incluido.',
    precio: 3500,
    imagenUrl: '/products/reloj-pared.jpg',
    categoria: 'Mejoras para el Hogar',
    stock: 12,
  },
];

export async function POST(request) {
  try {
    await dbConnect();

    // Clear existing products (for development only)
    await Product.deleteMany({});

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);

    return NextResponse.json(
      {
        success: true,
        message: `${products.length} productos creados exitosamente`,
        count: products.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear productos', error: error.message },
      { status: 500 }
    );
  }
}
