import Koa from 'koa';
import cors from '@koa/cors';
import { config } from '../config';
import router from './routes';
import { connectDB } from './data-source';
import koaBody from 'koa-body';
import path from 'path';
import fs from 'fs';
import serve from 'koa-static';
import { errorHandler } from './middlewares/errorHandler';
import { connectToRabbitMQ } from './rabbitmq/connection';

async function startup() {
  try {
    const app = new Koa();

    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await connectDB();
    await connectToRabbitMQ();
    app.use(cors({ credentials: true }));
    app.use(errorHandler);
    app.use(
      koaBody({
        multipart: true,
        json: true,
        text: true,
        formidable: {
          uploadDir,
          keepExtensions: true,
        },
      }),
    );

    app.use(serve(path.join(uploadDir)));

    app.use(router.routes()).use(router.allowedMethods());

    app.listen(config, () => {
      console.log(
        `Post-service running on port ${config.port} in ${config.environment} environment`,
      );
    });
  } catch (err) {
    console.error('[Startup Error]', err);
    process.exit(1);
  }
}
startup();
