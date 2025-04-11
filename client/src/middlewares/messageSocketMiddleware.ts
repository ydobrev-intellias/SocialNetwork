import { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { API_MESSAGE_PATH } from '@/config';
import { messageActions } from '@/redux/slices/messageSlice';

let socket: Socket | null = null;

export const createMessageSocketMiddleware = (url: string): Middleware => {
  return (store) => (next) => (action) => {
    if (messageActions.connect.match(action)) {
      if (!socket) {
        socket = io(url, {
          path: API_MESSAGE_PATH,
          query: {
            userId: action.payload.userId,
          },
        });

        socket.on('connect', () => {
          store.dispatch(messageActions.connected());
        });

        socket.on('disconnect', () => {
          store.dispatch(messageActions.disconnected());
        });

        socket.on('message', (data: any) => {
          store.dispatch(messageActions.messageReceived(data));
        });

        socket.on('messages', (data: any) => {
          store.dispatch(messageActions.messagesReceived(data));
        });

        socket.on('message_deleted', (messageId: string) => {
          store.dispatch(messageActions.messageDeleted(messageId));
        });

        socket.on('message_updated', (data) => {
          store.dispatch(messageActions.messageUpdated(data));
        });

        socket.on('error', (error) => {
          store.dispatch(messageActions.errorOccurred(error.message || 'Socket error'));
        });
      }
    }

    if (messageActions.disconnect.match(action) && socket) {
      socket.disconnect();
      socket = null;
    }

    if (messageActions.sendMessage.match(action) && socket) {
      socket.emit('message', action.payload);
    }
    if (messageActions.getMessages.match(action) && socket) {
      socket.emit('messages', action.payload.receiverId);
    }
    if (messageActions.deleteMessage.match(action) && socket) {
      socket.emit('delete_message', action.payload.messageId);
    }
    if (messageActions.updateMessage.match(action) && socket) {
      socket.emit('update_message', action.payload);
    }

    return next(action);
  };
};
