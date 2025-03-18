import Router from 'koa-router';
import { likePostController, unlikePostController } from '../controllers/like.controller';

const router = new Router();

router.delete('/likes/:likeId', unlikePostController);

router.post('/:postId/likes', likePostController);

export default router;
