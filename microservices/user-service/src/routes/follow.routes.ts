import Router from 'koa-router';
import { followController, unfollowController } from '../controllers/follow.controller';

const router = new Router();

router.post('/follow/:userId', followController);
router.post('/unfollow/:userId', unfollowController);

export default router;
