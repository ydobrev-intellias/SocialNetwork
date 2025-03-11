import { SchemaObject } from 'ajv';

const userSchema: SchemaObject = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['username', 'password'],
  additionalProperties: false,
};
export default userSchema;
