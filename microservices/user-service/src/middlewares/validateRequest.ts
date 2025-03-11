import { Context, Next } from 'koa';
import { schemaValidator } from '../validators/schemaValidator';

export const validateRequest = (schema: object) => {
  return async (ctx: Context, next: Next) => {
    const validator = schemaValidator(schema);
    const invalid = validator(ctx.request.body);

    if (invalid) {
      ctx.status = 400;
      ctx.body = {
        message: 'Invalid request data',
        errors: invalid,
      };
      return;
    }

    await next();
  };
};
