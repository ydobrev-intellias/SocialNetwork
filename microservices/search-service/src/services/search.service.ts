import axios from 'axios';
import { Context } from 'koa';
import { config } from '../../config';

interface SearchParams {
  query: string;
  role?: string;
}

export const search = async (ctx: Context) => {
  const { query, role } = ctx.query;

  if (!query || Array.isArray(query)) {
    ctx.throw(400, 'Query parameter is required and must be a string.');
  }

  const searchParams: SearchParams = { query };

  if (role && !Array.isArray(role)) {
    searchParams.role = role;
  }

  const userQueryString = new URLSearchParams(searchParams as any).toString();

  const postQueryString = new URLSearchParams(searchParams as any).toString();

  const userResponse = await axios.get(`${config.userServiceUrl}/search?${userQueryString}`, {
    withCredentials: true,
  });

  const postResponse = await axios.get(`${config.postServiceUrl}/search?${postQueryString}`, {
    withCredentials: true,
  });

  return { users: userResponse.data, posts: postResponse.data };
};
