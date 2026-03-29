import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import { verifyAuthToken } from '@/lib/auth';

const updateNotificationHandler = async (req, { params }) => {
  try {
    await connectDB();
    const userId = req.user.id; // verifyAuth attaches user to request
    const notificationId = params.id;

    const notification = await Notification.findOne({ _id: notificationId, user_id: userId });

    if (!notification) {
      return NextResponse.json({ message: 'Notificación no encontrada' }, { status: 404 });
    }

    notification.leido = true;
    await notification.save();

    return NextResponse.json({ message: 'Notificación marcada como leída', notification }, { status: 200 });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
};

export const PATCH = verifyAuthToken(updateNotificationHandler);
