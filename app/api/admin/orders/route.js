import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Notification from '@/models/Notification';
import { verifyRole } from '@/lib/auth';

const getOrdersHandler = async (req) => {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
};

const updateOrderStatusHandler = async (req) => {
  try {
    const body = await req.json();
    const { orderId, estado_envio } = body;

    if (!orderId || !estado_envio) {
      return NextResponse.json({ message: 'Faltan datos requeridos (orderId, estado_envio)' }, { status: 400 });
    }

    const estadosValidos = ['Preparando', 'Enviado', 'Entregado', 'Cancelado'];
    if (!estadosValidos.includes(estado_envio)) {
      return NextResponse.json({ message: 'Estado de envío no válido' }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: 'Orden no encontrada' }, { status: 404 });
    }

    order.estado_envio = estado_envio;
    await order.save();

    // Create a notification for the user if user_id exists
    if (order.user_id) {
      await Notification.create({
        user_id: order.user_id,
        titulo: 'Actualización de Pedido',
        mensaje: `Tu pedido #${order._id.toString().slice(-6)} ahora está ${estado_envio}`,
      });
    }

    return NextResponse.json({ message: 'Estado actualizado correctamente', order }, { status: 200 });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
};

export const GET = verifyRole(['admin', 'master'], getOrdersHandler);
export const PATCH = verifyRole(['admin', 'master'], updateOrderStatusHandler);
