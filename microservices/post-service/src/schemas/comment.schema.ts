import { JSONSchemaType } from 'ajv';
import { CreateOrUpdateCommentSchema } from '../types/comment';

export const createOrUpdateCommentSchema: JSONSchemaType<CreateOrUpdateCommentSchema> = {
  type: 'object',
  properties: {
    content: { type: 'string' },
  },
  required: ['content'],
  additionalProperties: false,
};
