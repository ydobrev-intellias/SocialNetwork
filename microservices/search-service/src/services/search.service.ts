import axios from 'axios';
import { Context } from 'koa';

export const search = async (ctx: Context) => {
  const { query } = ctx.query;

  const userResponse = await axios.get(`http://user-service:4002/search?query=${query}`, {
    withCredentials: true,
  });

  const postResponse = await axios.get(`http://post-service:4003/search?query=${query}`, {
    withCredentials: true,
  });

  return { users: userResponse.data, posts: postResponse.data };
};
