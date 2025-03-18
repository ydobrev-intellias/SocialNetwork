import { SchemaObject } from 'ajv';

export const signUpSchema: SchemaObject = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    role: { enum: ['user', 'admin'] },
  },
  required: ['username', 'email', 'password'],
  additionalProperties: false,
};

export const signInSchema: SchemaObject = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};
