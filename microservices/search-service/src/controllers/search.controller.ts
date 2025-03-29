import { Context } from 'koa';
import { search } from '../services/search.service';

export const searchController = async (ctx: Context) => {
  const searchResult = await search(ctx);
  ctx.status = 200;
  ctx.body = searchResult;
};
