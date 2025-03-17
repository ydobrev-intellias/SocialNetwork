import Router from 'koa-router';
import authRoutes from './auth.routes';

const router = new Router();

router.use(authRoutes.routes());

export default router;
