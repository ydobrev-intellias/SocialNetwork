import { SchemaObject } from 'ajv';

const authUserSchema: SchemaObject = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
    role: { enum: ['user', 'admin'] },
  },
  required: ['username', 'password'],
  additionalProperties: false,
};
export default authUserSchema;
