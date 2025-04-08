import { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { socketActions } from '@/redux/slices/socketSlice';

let socket: Socket | null = null;

export const createSocketMiddleware = (url: string): Middleware => {
  return (store) => (next) => (action) => {
    if (socketActions.connect.match(action)) {
      if (!socket) {
        console.log(action.payload.userId);
        socket = io(url, {
          query: {
            userId: action.payload.userId,
          },
        });

        socket.on('connect', () => {
          store.dispatch(socketActions.connected());
        });

        socket.on('disconnect', () => {
          store.dispatch(socketActions.disconnected());
        });

        socket.on('message', (data: any) => {
          store.dispatch(socketActions.messageReceived(data));
        });

        socket.on('messages', (data: any) => {
          store.dispatch(socketActions.messagesReceived(data));
        });

        socket.on('message_deleted', (messageId: string) => {
          store.dispatch(socketActions.messageDeleted(messageId));
        });

        socket.on('message_updated', (data) => {
          store.dispatch(socketActions.messageUpdated(data));
        });

        socket.on('error', (error) => {
          store.dispatch(socketActions.errorOccurred(error.message || 'Socket error'));
        });
      }
    }

    if (socketActions.disconnect.match(action) && socket) {
      socket.disconnect();
      socket = null;
    }

    if (socketActions.sendMessage.match(action) && socket) {
      socket.emit('message', action.payload);
    }
    if (socketActions.getMessages.match(action) && socket) {
      socket.emit('messages', action.payload.receiverId);
    }
    if (socketActions.deleteMessage.match(action) && socket) {
      socket.emit('delete_message', action.payload.messageId);
    }
    if (socketActions.updateMessage.match(action) && socket) {
      socket.emit('update_message', action.payload);
    }

    return next(action);
  };
};
