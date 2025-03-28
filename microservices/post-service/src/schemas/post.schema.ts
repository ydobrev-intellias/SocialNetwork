import { JSONSchemaType } from 'ajv';
import { CreatePostSchema, UpdatePostSchema } from '../types/post';

export const createPostSchema: JSONSchemaType<CreatePostSchema> = {
  type: 'object',
  properties: {
    content: { type: 'string' },
    privacy: { enum: ['private', 'public'] },
  },
  required: ['content'],
  additionalProperties: true,
};

export const updatePostSchema: JSONSchemaType<UpdatePostSchema> = {
  type: 'object',
  properties: {
    content: { type: 'string' },
    privacy: { enum: ['private', 'public'] },
  },
  required: [],
  additionalProperties: true,
};
