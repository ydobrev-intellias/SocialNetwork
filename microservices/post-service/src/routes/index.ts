import Router from 'koa-router';
import postRoutes from './post.routes';
import likeRoutes from './like.routes';
import commentRoutes from './comment.routes';

const router = new Router();

router.use(postRoutes.routes());
router.use(likeRoutes.routes());
router.use(commentRoutes.routes());

export default router;
