import { SchemaObject } from 'ajv';

const updateContactSchema: SchemaObject = {
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
export default updateContactSchema;
