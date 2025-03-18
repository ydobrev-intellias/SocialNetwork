import { SchemaObject } from 'ajv';

export const createContactSchema: SchemaObject = {
  type: 'object',
  properties: {
    type: {
      enum: ['linkedin', 'phone', 'email'],
    },
    value: { type: 'string' },
  },
  required: ['type', 'value'],
  additionalProperties: false,
};

export const updateContactSchema: SchemaObject = {
  type: 'object',
  properties: {
    type: {
      enum: ['linkedin', 'phone', 'email'],
    },
    value: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
};
