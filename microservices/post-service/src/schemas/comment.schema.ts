import { JSONSchemaType } from 'ajv';
import { CreateCommentSchema, UpdateCommentSchema } from '../types/comment';

export const createCommentSchema: JSONSchemaType<CreateCommentSchema> = {
  type: 'object',
  properties: {
    content: { type: 'string' },
  },
  required: ['content'],
  additionalProperties: false,
};

export const updateCommentSchema: JSONSchemaType<UpdateCommentSchema> = {
  type: 'object',
  properties: {
    content: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
};
