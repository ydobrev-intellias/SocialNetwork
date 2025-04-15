import { Context, Next } from 'koa';

const validateRequest = async (ctx: Context, next: Next) => {
  const errorMessageHeader = ctx.headers['x-auth-error-message'];
  const errorStatusHeader = ctx.headers['x-auth-error-status'];

  if (errorMessageHeader && errorStatusHeader) {
    const errorMessage = errorMessageHeader;
    const errorStatus = Number(errorStatusHeader as string);
    ctx.cookies.set('jwt', '');
    ctx.status = errorStatus;
    ctx.body = errorMessage;
    return;
  }

  await next();
};
export default validateRequest;
