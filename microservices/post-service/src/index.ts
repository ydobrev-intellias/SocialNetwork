import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
import { config } from '../config';

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.listen(config, () => {
  console.log(`Post-service running on port ${config.port} in ${config.environment} environment`);
});
