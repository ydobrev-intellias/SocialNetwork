import { SchemaObject } from 'ajv';

export const updateContactSchema: SchemaObject = {
  type: 'object',
  properties: {
    type: {
      enum: ['linkedin', 'phone'],
    },
    value: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
};

export const createContactSchema: SchemaObject = {
  type: 'object',
  properties: {
    type: {
      enum: ['linkedin', 'phone'],
    },
    value: { type: 'string' },
  },
  additionalProperties: false,
};
