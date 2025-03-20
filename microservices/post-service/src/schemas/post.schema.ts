import { SchemaObject } from 'ajv';

export const createPostSchema: SchemaObject = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    privacy: { enum: ['private', 'public'] },
  },
  required: ['content', 'title'],
  additionalProperties: false,
};

export const updatePostSchema: SchemaObject = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    privacy: { enum: ['private', 'public'] },
  },
  required: [],
  additionalProperties: false,
};
