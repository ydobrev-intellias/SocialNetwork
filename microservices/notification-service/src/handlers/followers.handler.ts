import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const handleFollowerNotifications =
  (io: Server, connectedUsers: Record<string, string>) => (payload: any) => {
    const { content, followers, targetId, createdAt } = payload;

    followers.forEach((follow: any) => {
      const socketId = connectedUsers[follow.follower.id];
      if (socketId) {
        io.to(socketId).emit('notification', {
          content,
          id: uuidv4(),
          targetId,
          eventTime: createdAt,
        });
      }
    });
  };
export default handleFollowerNotifications;
