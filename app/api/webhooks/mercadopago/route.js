import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export async function POST(request) {
  try {
    // Parseamos la notificación que envía Mercado Pago
    // Puede variar según la configuración: a veces es { data: { id } }, a veces es { id } directo,
    // y además type="payment" o topic="payment"
    const body = await request.json();
    
    // Obtenemos parámetros de la URL también por las dudas (a veces MP manda el id por query)
    const { searchParams } = new URL(request.url);
    const idQuery = searchParams.get('id');
    const topicQuery = searchParams.get('topic');
    const typeQuery = searchParams.get('type');

    const paymentId = body?.data?.id || body?.id || idQuery;
    const type = body?.type || topicQuery || typeQuery;

    // Solo nos interesan eventos de tipo pago
    if (type === 'payment' && paymentId) {
      await connectDB();

      const paymentClient = new Payment(client);
      const paymentInfo = await paymentClient.get({ id: paymentId });

      // Si tenemos info del pago, buscamos nuestra orden enlazada
      if (paymentInfo && paymentInfo.external_reference) {
        const orderId = paymentInfo.external_reference;
        const order = await Order.findById(orderId);

        if (order) {
          // Si el pago está aprobado y la orden sigue pendiente, actualizamos!
          if (paymentInfo.status === 'approved' && order.estado_pago !== 'Pagado') {
            order.estado_pago = 'Pagado';
            order.mp_payment_id = paymentId;
            await order.save();
            console.log(`[Webhook] ✅ Orden ${orderId} actualizada a Pagado (Pago ID: ${paymentId})`);
          } else if (paymentInfo.status === 'rejected') {
            order.estado_pago = 'Rechazado';
            order.mp_payment_id = paymentId;
            await order.save();
            console.log(`[Webhook] ❌ Orden ${orderId} actualizada a Rechazado (Pago ID: ${paymentId})`);
          }
        } else {
             console.warn(`[Webhook] ⚠️ Orden con ID ${orderId} enlazada externa no encontrada en la DB.`);
        }
      } else {
         console.warn(`[Webhook] ⚠️ Pago sin external_reference recibido: ${paymentId}`);
      }
    }

    // Mercado Pago requiere una respuesta 200 INMEDIATA, si no el webhook reintenta indefinidamente
    return NextResponse.json({ message: 'Recibido' }, { status: 200 });

  } catch (error) {
    console.error('Error procesando Webhook de Mercado Pago:', error);
    // Aunque haya error, mandamos 200 en producción a menos que queramos que MP reintente
    return NextResponse.json({ error: 'Error procesando webhook' }, { status: 200 });
  }
}
