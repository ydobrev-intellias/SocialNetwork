import { Context } from 'koa';
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from '../services/comment.service';

export const createCommentController = async (ctx: Context) => {
  const comment = await createComment(ctx);
  ctx.status = 201;
  ctx.body = comment;
};

export const deleteCommentController = async (ctx: Context) => {
  await deleteComment(ctx);
  ctx.status = 200;
  ctx.body = {};
};

export const updateCommentController = async (ctx: Context) => {
  const comment = await updateComment(ctx);
  ctx.status = 200;
  ctx.body = comment;
};

export const getCommentsController = async (ctx: Context) => {
  const comments = await getComments(ctx);
  ctx.status = 200;
  ctx.body = comments;
};
