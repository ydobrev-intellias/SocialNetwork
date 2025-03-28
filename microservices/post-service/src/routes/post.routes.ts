import Router from 'koa-router';
import {
  createPostController,
  createRepostController,
  deletePostController,
  getActivityWallController,
  getPostController,
  updatePostController,
  deleteUserActivityController,
} from '../controllers/post.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { createPostSchema, updatePostSchema } from '../schemas/post.schema';

const router = new Router();

router.get('/', getActivityWallController);

router.post('/', validateSchema(createPostSchema), createPostController);

router.delete('/activity/:userId', deleteUserActivityController);

router.get('/:postId', getPostController);

router.delete('/:postId', deletePostController);

router.patch('/:postId', validateSchema(updatePostSchema), updatePostController);

router.post('/:postId/reposts', validateSchema(createPostSchema), createRepostController);

export default router;
