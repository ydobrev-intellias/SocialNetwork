import Router from 'koa-router';
import userRoutes from './user.routes';
import contactRoutes from './contact.routes';
import searchRoutes from './search.routes';
import followRoutes from './follow.routes';

const router = new Router();

router.use(followRoutes.routes());
router.use(searchRoutes.routes());
router.use(userRoutes.routes());
router.use(contactRoutes.routes());

export default router;
