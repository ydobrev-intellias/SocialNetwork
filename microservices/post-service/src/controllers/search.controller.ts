import { Context } from 'koa';
import { searchPosts } from '../services/search.service';

export const searchController = async (ctx: Context) => {
  const result = await searchPosts(ctx);
  ctx.status = 200;
  ctx.body = result;
};
