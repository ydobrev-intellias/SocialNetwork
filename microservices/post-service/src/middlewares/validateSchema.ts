import { Context, Next } from 'koa';
import { schemaValidator } from '../validators/schema.validator';
import { JSONSchemaType } from 'ajv';

export const validateSchema = <T extends object>(schema: JSONSchemaType<T>) => {
  return async (ctx: Context, next: Next) => {
    const validator = schemaValidator(schema);

    const invalid = validator(ctx.request.body);

    if (invalid) {
      console.error(invalid);
      ctx.throw(400, invalid);
    }

    await next();
  };
};
