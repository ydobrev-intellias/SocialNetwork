import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import redis from '../redis/client';
import { config } from '../../config';

export const validateRequest = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get('jwt');

  if (!token) {
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
