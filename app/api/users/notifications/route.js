import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import { verifyAuthToken } from '@/lib/auth';

const getNotificationsHandler = async (req) => {
  try {
    await connectDB();
    const userId = req.user.id; // verifyAuth attaches user to request

    const notifications = await Notification.find({ user_id: userId }).sort({ createdAt: -1 });
    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
};

export const GET = verifyAuthToken(getNotificationsHandler);
