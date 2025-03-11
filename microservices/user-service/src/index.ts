import Koa from 'koa';
import cors from '@koa/cors';
import { config } from '../config';
import router from './routes'

const app = new Koa();

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, () => {
  console.log(`User-service running on port ${config.port} in ${config.environment} environment`);
});
