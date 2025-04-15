import { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { API_NOTIFICATION_PATH } from '@/config';
import { notificationActions } from '@/redux/slices/notificationSlice';

let socket: Socket | null = null;

export const createNotificationSocketMiddleware = (url: string): Middleware => {
  return (store) => (next) => (action) => {
    if (notificationActions.connect.match(action)) {
      if (!socket) {
        socket = io(url, {
          path: API_NOTIFICATION_PATH,
          query: {
            userId: action.payload.userId,
          },
        });

        socket.on('connect', () => {
          store.dispatch(notificationActions.connected());
        });

        socket.on('notification', (data: any) => {
          store.dispatch(notificationActions.notificationsReceived(data));
        });

        socket.on('disconnect', () => {
          store.dispatch(notificationActions.disconnected());
        });

        socket.on('error', (error) => {
          store.dispatch(notificationActions.errorOccurred(error.message || 'Socket error'));
        });
      }
    }

    if (notificationActions.disconnect.match(action) && socket) {
      socket.disconnect();
      socket = null;
    }

    return next(action);
  };
};
