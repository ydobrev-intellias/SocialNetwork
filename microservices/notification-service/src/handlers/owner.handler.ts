import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const handleOwnerNotifications =
  (io: Server, connectedUsers: Record<string, string>) => (payload: any) => {
    console.log('Connected users', connectedUsers);
    const { content, ownerId, targetId, createdAt } = payload;
    const socketId = connectedUsers[ownerId];
    console.log('Handle owner notifications', { content, ownerId, targetId, createdAt });
    if (socketId) {
      io.to(socketId).emit('notification', {
        content,
        id: uuidv4(),
        targetId,
        eventTime: createdAt,
      });
    }
  };
export default handleOwnerNotifications;
