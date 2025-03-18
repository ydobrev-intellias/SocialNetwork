import Router from 'koa-router';
import postRoutes from './post.routes';
import likeRoutes from './like.routes';

const router = new Router();

router.use(postRoutes.routes());
router.use(likeRoutes.routes());

export default router;
