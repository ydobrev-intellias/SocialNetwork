import Router from 'koa-router';
import postRoutes from './post.routes';
import likeRoutes from './like.routes';
import commentRoutes from './comment.routes';
import searchRoutes from './search.routes';

const router = new Router();

router.use(searchRoutes.routes());
router.use(postRoutes.routes());
router.use(likeRoutes.routes());
router.use(commentRoutes.routes());

export default router;
