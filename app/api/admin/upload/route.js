import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { verifyRole } from '@/lib/auth';

// Helper to handle the actual upload
const uploadHandler = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No se encontró ningún archivo' }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary uploader
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    console.log(`Intentando subir imagen para usuario: ${req.user.email} (Role: ${req.user.role})`);

    // Upload to Cloudinary into a specific folder
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'risewave_products',
      resource_type: 'image',
    });

    return NextResponse.json(
      {
        message: 'Imagen subida exitosamente',
        image: {
          public_id: uploadResponse.public_id,
          url: uploadResponse.secure_url,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { message: 'Error al subir la imagen al servidor de medios' },
      { status: 500 }
    );
  }
};

// Protect this route: only admin and master can upload product images
export const POST = verifyRole(['admin', 'master'], uploadHandler);
