import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const handleFollowerNotifications =
  (io: Server, connectedUsers: Record<string, string>) => (payload: any) => {
    console.log('Connected users', connectedUsers);
    const { content, followers, targetId, createdAt } = payload;

    followers.forEach((follow: any) => {
      console.log('Follow', follow);
      const socketId = connectedUsers[follow.follower.id];
      console.log('Socketid', socketId);
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
