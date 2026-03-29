import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

// Inicializa el cliente MercadoPagoConfig usando la variable de entorno MP_ACCESS_TOKEN
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export async function POST(request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const { items, payer } = await request.json();

    // Validar datos mínimos
    if (!payer || !payer.email || !payer.name) {
      return NextResponse.json({ message: 'Faltan datos del comprador' }, { status: 400 });
    }

    // Transforma los productos al formato de Mercado Pago
    let totalCalculado = 0;
    const mpItems = items.map(item => {
      const price = Number(item.precio);
      const qty = Number(item.quantity);
      totalCalculado += price * qty;
      return {
        id: item.id.toString(),
        title: item.titulo,
        quantity: qty,
        unit_price: price,
        currency_id: 'ARS',
      };
    });

    // Parse buyer data
    const comprador = {
      nombre: `${payer.name} ${payer.surname || ''}`.trim(),
      email: payer.email,
      telefono: payer.telefono || 'No especificado'
    };

    // Parse shipping data
    const datosEnvio = payer.direccion ? {
      calle: payer.direccion.calle || '',
      altura: payer.direccion.altura || '',
      ciudad: payer.direccion.ciudad || '',
      codigoPostal: payer.direccion.codigoPostal || '',
      provincia: payer.direccion.provincia || ''
    } : {
      calle: 'No especificada',
      altura: '0',
      ciudad: 'No especificada',
      codigoPostal: '0000'
    };
    
    // Parse order items for DB
    const orderItems = items.map(item => ({
      product_id: item.id,
      titulo: item.titulo,
      precio: Number(item.precio),
      cantidad: Number(item.quantity),
      color: item.color || null
    }));

    await connectDB();

    // Creacion del documento de Orden inicial
    const nuevaOrden = new Order({
      comprador,
      datosEnvio,
      items: orderItems,
      total: totalCalculado,
      estado_pago: 'Pendiente',
      estado_envio: 'Preparando'
    });

    await nuevaOrden.save();

    const preference = new Preference(client);

    // Only send notification_url if we have a real public URL (MercadoPago rejects localhost)
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');

    console.log('URL de éxito enviada:', baseUrl + '/payment-success');
    if (isLocalhost) {
      console.warn('[MP] ⚠️ notification_url omitida porque baseUrl es localhost');
    }

    const response = await preference.create({
      body: {
        items: mpItems,
        payer: {
          email: payer.email
        },
        back_urls: {
          success: `${baseUrl}/payment-success`,
          failure: `${baseUrl}/payment-failure`,
          pending: `${baseUrl}/payment-pending`,
        },
        auto_return: 'approved',
        external_reference: nuevaOrden._id.toString(),
        ...(isLocalhost ? {} : { notification_url: `${baseUrl}/api/webhooks/mercadopago` }),
      }
    });

    // Actualizar la orden con el ID de la preferencia
    nuevaOrden.mp_preference_id = response.id;
    await nuevaOrden.save();

    return NextResponse.json({ preferenceId: response.id }, { status: 200 });

  } catch (error) {
    console.error('Error al crear preferencia de MP:', error);
    // Manejo de errores con try/catch y devuelve un status 500 en caso de falla
    return NextResponse.json({ message: 'Error interno de MercadoPago' }, { status: 500 });
  }
}
