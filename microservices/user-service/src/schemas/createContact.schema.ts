import { SchemaObject } from 'ajv';

const createContactSchema: SchemaObject = {
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
export default createContactSchema;
