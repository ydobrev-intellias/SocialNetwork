import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import redis from '../redis/client';
import { config } from '../../config';

const allowedRoutes = [
  '/api/posts/',
  /^\/api\/posts\/medias\/.+\.\w+$/,
  /^\/api\/users\/avatars\/.+\.\w+$/,
  /^\/api\/posts\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/comments$/,
  /^\/api\/posts\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  /^\/api\/users\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  /^\/api\/search\/.+/,
];

export const validateRequest = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get('jwt');
  const xOriginalUri = ctx.headers['x-original-uri'];
  const xOriginalMethod = ctx.headers['x-original-method'];
  console.log(`${xOriginalUri} ${xOriginalMethod} ${token}`);
  if (xOriginalMethod === 'OPTIONS') {
    ctx.status = 204;
    return;
  }
  const isAllowedRoute = allowedRoutes.some((route) => {
    if (typeof route === 'string') {
      return (xOriginalUri as string) === route;
    }
    if (route instanceof RegExp) {
      return route.test(xOriginalUri as string);
    }
    return false;
  });

  if (!token) {
    console.log('isAllowedRoute', isAllowedRoute);
    if (isAllowedRoute && xOriginalMethod === 'GET') {
      ctx.status = 200;
      await next();
      return;
    }
    ctx.status = 401;
    return;
  }

  const blacklisted = await redis.get(`blacklisted:${token}`);
  if (blacklisted) {
    ctx.status = 403;
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    ctx.status = 200;
    ctx.set('X-Auth-User-Data', JSON.stringify(decoded));
    await next();
  } catch (err) {
    ctx.status = 401;
    return;
  }
};
