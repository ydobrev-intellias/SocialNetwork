import Router from 'koa-router';
import { likePostController, unlikePostController } from '../controllers/like.controller';

const router = new Router();

router.post('/:postId/likes', likePostController);

router.delete('/likes/:likeId', unlikePostController);

export default router;
