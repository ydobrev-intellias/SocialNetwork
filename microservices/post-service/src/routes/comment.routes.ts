import Router from 'koa-router';
import {
  deleteCommentController,
  getCommentsController,
  updateCommentController,
} from '../controllers/comment.controller';
import { createPostController } from '../controllers/post.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { createCommentSchema, updateCommentSchema } from '../schemas/comment.schema';

const router = new Router();

router.get('/:postId/comments', getCommentsController);

router.post('/:postId/comments', validateSchema(createCommentSchema), createPostController);

router.patch('/comments/:commentId', validateSchema(updateCommentSchema), updateCommentController);

router.patch('/comments/:commentId', deleteCommentController);

export default router;
