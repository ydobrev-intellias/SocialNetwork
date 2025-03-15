import Koa from 'koa';
import cors from '@koa/cors';
import { config } from '../config';
import router from './routes';
import bodyParser from 'koa-bodyparser';
import { connectDB } from './data-source';

const app = new Koa();

connectDB();
app.use(bodyParser());
app.use(cors());

app.use(router.routes()).use(router.allowedMethods());
app.listen(config.port, async () => {
  console.log(`Auth-service running on port ${config.port} in ${config.environment} environment`);
});
