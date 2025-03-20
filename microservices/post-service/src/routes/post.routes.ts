import Router from 'koa-router';
import {
  createPostController,
  createRepostController,
  deletePostController,
  getPostController,
  updatePostController,
} from '../controllers/post.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { createPostSchema, updatePostSchema } from '../schemas/post.schema';
import { getActivityWall } from '../services/post.service';

const router = new Router();

router.get('/', getActivityWall);

router.post('/', validateSchema(createPostSchema), createPostController);

router.get('/:postId', getPostController);

router.delete('/:postId', deletePostController);

router.patch('/:postId', validateSchema(updatePostSchema), updatePostController);

router.post('/:postId/reposts', createRepostController);

export default router;
