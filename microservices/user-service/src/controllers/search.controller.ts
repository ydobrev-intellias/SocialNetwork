import { Context } from 'koa';
import { searchUsers } from '../services/search.service';

export const searchController = async (ctx: Context) => {
  const result = await searchUsers(ctx);
  ctx.status = 200;
  ctx.body = result;
};
