import Koa, { Context, Next } from 'koa';
import cors from '@koa/cors';
import { config } from '../config';
import router from './routes';
import bodyParser from 'koa-bodyparser';
import { connectDB } from './data-source';
import { errorHandler } from './middlewares/errorHandler';

const app = new Koa();

connectDB();
app.use(
  cors({
    credentials: true,
  }),
);
app.use(errorHandler);
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());
app.listen(config.port, async () => {
  console.log(`Auth-service running on port ${config.port} in ${config.environment} environment`);
});
