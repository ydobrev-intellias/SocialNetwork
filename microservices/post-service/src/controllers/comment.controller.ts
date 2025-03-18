import { Context } from 'koa';
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from '../services/comment.service';

export const createCommentController = async (ctx: Context) => {
  await createComment(ctx);
};

export const deleteCommentController = async (ctx: Context) => {
  await deleteComment(ctx);
};

export const updateCommentController = async (ctx: Context) => {
  await updateComment(ctx);
};

export const getCommentsController = async (ctx: Context) => {
  await getComments(ctx);
};
