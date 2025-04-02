import { Context } from 'koa';
import { follow, unfollow } from '../services/follow.service';

export const followController = async (ctx: Context) => {
  const contact = await follow(ctx);
  ctx.status = 200;
  ctx.body = contact;
};

export const unfollowController = async (ctx: Context) => {
  await unfollow(ctx);
  ctx.status = 204;
  ctx.body = {};
};
