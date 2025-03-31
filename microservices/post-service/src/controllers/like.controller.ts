import { Context, HttpError } from 'koa';
import { likePost, unlikePost } from '../services/like.service';

export const likePostController = async (ctx: Context) => {
  const like = await likePost(ctx);
  ctx.status = 201;
  ctx.body = like;
};

export const unlikePostController = async (ctx: Context) => {
  await unlikePost(ctx);
  ctx.status = 204;
  ctx.body = {};
};
