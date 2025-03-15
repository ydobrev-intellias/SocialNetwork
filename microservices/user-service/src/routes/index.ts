import Router from 'koa-router';
import userRoutes from './user.routes';
import contactRoutes from './contact.routes';

const router = new Router();

router.use(userRoutes.routes());
router.use(contactRoutes.routes());

export default router;
