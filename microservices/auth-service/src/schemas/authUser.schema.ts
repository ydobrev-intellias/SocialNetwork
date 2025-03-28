import { JSONSchemaType, SchemaObject } from 'ajv';

export const signUpSchema: SchemaObject = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string', minLength: 6 },
    role: { enum: ['user', 'admin'] },
  },
  required: ['username', 'email', 'password'],
  additionalProperties: false,
};

export const signInSchema: SchemaObject = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string', minLength: 6 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};
