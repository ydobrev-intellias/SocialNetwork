import { Context, HttpError, Next } from 'koa';
import { QueryFailedError } from 'typeorm';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HttpError) {
      ctx.status = error.status;
      ctx.body = error.message;
    } else if (error instanceof QueryFailedError) {
      ctx.status = 400;
      ctx.body = `Database error: ${error.message}`;
    } else if (error instanceof Error) {
      ctx.status = 500;
      ctx.body = `Internal Server Error: ${error.message}`;
    } else {
      ctx.status = 500;
      ctx.body = 'An unexpected error occurred.';
    }

    console.error(error);
  }
};
