import { JSONSchemaType } from 'ajv';
import { CreatePostSchema, UpdatePostSchema } from '../types/post';
import { PostPrivacy } from '../types/common';

export const createPostSchema: JSONSchemaType<CreatePostSchema> = {
  type: 'object',
  properties: {
    content: { type: 'string' },
    privacy: { type: 'string', enum: Object.values(PostPrivacy), nullable: true },
  },
  required: ['content'],
  additionalProperties: true,
};

export const updatePostSchema: JSONSchemaType<UpdatePostSchema> = {
  type: 'object',
  properties: {
    content: { type: 'string', nullable: true },
    privacy: { type: 'string', enum: Object.values(PostPrivacy), nullable: true },
  },
  required: [],
  additionalProperties: true,
};

export const createRepostSchema: JSONSchemaType<CreatePostSchema> = {
  type: 'object',
  properties: {
    content: { type: 'string' },
    privacy: { type: 'string', enum: Object.values(PostPrivacy), nullable: true },
  },
  required: ['content'],
  additionalProperties: false,
};
