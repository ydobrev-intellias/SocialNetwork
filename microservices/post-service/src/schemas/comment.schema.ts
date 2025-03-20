import { SchemaObject } from 'ajv';

export const createCommentSchema: SchemaObject = {
  type: 'object',
  properties: {
    content: { type: 'string' },
  },
  required: ['content'],
  additionalProperties: false,
};

export const updateCommentSchema: SchemaObject = {
  type: 'object',
  properties: {
    content: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
};
