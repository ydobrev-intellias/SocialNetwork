import { Context } from 'koa';
import { likePost, unlikePost } from '../services/like.service';

export const likePostController = async (ctx: Context) => {
  await likePost(ctx);
};

export const unlikePostController = async (ctx: Context) => {
  await unlikePost(ctx);
};
