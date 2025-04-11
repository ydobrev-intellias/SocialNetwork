import Koa from 'koa';
import { config } from '../config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from '@koa/cors';
import { connectToRabbitMQ } from './rabbitmq/connection';
import { registerConsumers } from './rabbitmq/registerConsumers';

async function startup() {
  try {
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

    const connectedUsers: Record<string, string> = {};
    await connectToRabbitMQ();
    await registerConsumers(io, connectedUsers);

    io.on('connection', async (socket) => {
      const userId = socket.handshake.query.userId as string;
      if (userId) {
        connectedUsers[userId] = socket.id;
        console.log(`User ${userId} connected with socket ${socket.id}`);
      }

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
        `Notification-service running on port ${config.port} in ${config.environment} environment`,
      );
    });
  } catch (err) {
    console.error('[Startup Error]', err);
    process.exit(1);
  }
}
startup();
