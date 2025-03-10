import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';

const PORT = process.env.PORT ?? 5002

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Post-service running on port ${PORT} in ${process.env.NODE_ENV} environment`);
});
