import Router from 'koa-router';
import {
  createCommentController,
  deleteCommentController,
  getCommentsController,
  updateCommentController,
} from '../controllers/comment.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { createOrUpdateCommentSchema } from '../schemas/comment.schema';

const router = new Router();

router.get('/:postId/comments', getCommentsController);

router.post(
  '/:postId/comments',
  validateSchema(createOrUpdateCommentSchema),
  createCommentController,
);

router.patch(
  '/comments/:commentId',
  validateSchema(createOrUpdateCommentSchema),
  updateCommentController,
);

router.delete('/comments/:commentId', deleteCommentController);

export default router;
