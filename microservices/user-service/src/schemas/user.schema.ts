import { SchemaObject } from 'ajv';

const userSchema: SchemaObject = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
    role: { enum: ['user', 'admin'] },
    contacts: {
      enum: ['linkedin', 'phone', 'email'],
    },
  },
  required: [],
  additionalProperties: false,
};
export default userSchema;
