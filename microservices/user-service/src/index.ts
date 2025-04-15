import Koa from 'koa';
import cors from '@koa/cors';
import { config } from '../config';
import router from './routes';
import koaBody from 'koa-body';
import { connectDB } from './data-source';
import serve from 'koa-static';
import fs from 'fs';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler';
import { connectToRabbitMQ } from './rabbitmq/connection';
import validateRequest from './middlewares/validateRequest';

async function startup() {
  const app = new Koa();

  const uploadDir = path.join(__dirname, '../uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  await connectDB();
  await connectToRabbitMQ();
  app.use(cors({ credentials: true }));
  app.use(validateRequest);
  app.use(errorHandler);
  app.use(koaBody());

  app.use(serve(path.join(__dirname, '../uploads')));

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(config.port, async () => {
    console.log(`User-service running on port ${config.port} in ${config.environment} environment`);
  });
}

startup();
