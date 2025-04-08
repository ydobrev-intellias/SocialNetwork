import Koa from 'koa';
import { config } from '../config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from '@koa/cors';
import { AppDataSource, connectDB } from './data-source';
import { Message } from './entities/Message';

const app = new Koa();

app.use(
  cors({
    credentials: true,
  }),
);

const server = createServer(app.callback());

const io = new Server(server, {
  path: '/',
  cors: {
    origin: '*',
    credentials: true,
  },
});

connectDB();

const connectedUsers: Record<string, string> = {};

io.on('connection', async (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    connectedUsers[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  }

  const messageRepository = AppDataSource.getRepository(Message);

  socket.on('messages', async (receiverId: string) => {
    if (!userId || !receiverId) return;

    const messages = await messageRepository.find({
      where: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
      order: { timestamp: 'ASC' },
    });

    const senderSocketId = connectedUsers[userId];
    if (senderSocketId) {
      io.to(senderSocketId).emit('messages', messages);
    }
  });

  socket.on('message', async (messageData) => {
    const message = messageRepository.create(messageData as Object);
    await messageRepository.save(message);

    const senderSocketId = connectedUsers[message.senderId];
    const receiverSocketId = connectedUsers[message.receiverId];

    if (senderSocketId) {
      io.to(senderSocketId).emit('message', message);
    }

    if (receiverSocketId && receiverSocketId !== senderSocketId) {
      io.to(receiverSocketId).emit('message', message);
    }
  });

  socket.on('delete_message', async (messageId) => {
    const message = await messageRepository.findOne({ where: { id: messageId } });
    if (!message) return;
    const senderSocketId = connectedUsers[message?.senderId];
    const receiverSocketId = connectedUsers[message?.receiverId];
    await messageRepository.remove(message);

    io.to(senderSocketId).emit('message_deleted', messageId);
    io.to(receiverSocketId).emit('message_deleted', messageId);
  });

  socket.on('update_message', async (messageData) => {
    const { messageId, newContent } = messageData;

    const message = await messageRepository.findOne({ where: { id: messageId } });
    if (!message) return;

    message.content = newContent;
    await messageRepository.save(message);

    const senderSocketId = connectedUsers[message.senderId];
    const receiverSocketId = connectedUsers[message.receiverId];

    io.to(senderSocketId).emit('message_updated', message);
    io.to(receiverSocketId).emit('message_updated', message);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    for (const [uid, sid] of Object.entries(connectedUsers)) {
      if (sid === socket.id) {
        delete connectedUsers[uid];
        break;
      }
    }
  });
});

server.listen(config.port, async () => {
  console.log(
    `Message-service running on port ${config.port} in ${config.environment} environment`,
  );
});
