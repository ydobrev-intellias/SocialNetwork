import cors from '@koa/cors';
import Koa from 'koa';
import router from './routes';
import { config } from '../config';
import { errorHandler } from './middlewares/errorHandler';

const app = new Koa();

app.use(cors({ credentials: true }));

app.use(errorHandler);

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, async () => {
  console.log(`Search-service running on port ${config.port} in ${config.environment} environment`);
});
