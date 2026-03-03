import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Inicializa el cliente MercadoPagoConfig usando la variable de entorno MP_ACCESS_TOKEN
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export async function POST(request) {
  try {
    const { items, payer } = await request.json();

    // Validar que el carrito no esté vacío
    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'El carrito está vacío' }, { status: 400 });
    }

    // Transforma los productos al formato de Mercado Pago
    const mpItems = items.map(item => ({
      id: item.id.toString(),
      title: item.titulo,
      quantity: Number(item.quantity),
      unit_price: Number(item.precio),
      currency_id: 'ARS',
    }));

    // Asegúrate de que baseUrl no tenga una barra al final antes de usarla
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: mpItems,
        payer: {
          email: "test_user_mail@testuser.com" // Email genérico para forzar validación
        },
        back_urls: {
          // Usamos URLs HTTPS públicas temporalmente para evadir el bloqueo de localhost
          success: "https://www.google.com/search?q=exito",
          failure: "https://www.google.com/search?q=fallo",
          pending: "https://www.google.com/search?q=pendiente"
        },
        auto_return: 'approved'
      }
    });

    return NextResponse.json({ preferenceId: response.id }, { status: 200 });

  } catch (error) {
    console.error('Error al crear preferencia de MP:', error);
    // Manejo de errores con try/catch y devuelve un status 500 en caso de falla
    return NextResponse.json({ message: 'Error interno de MercadoPago' }, { status: 500 });
  }
}
