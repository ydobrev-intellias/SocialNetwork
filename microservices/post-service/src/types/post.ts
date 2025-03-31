import { PostPrivacy } from './common';

export interface CreatePostSchema {
  content: string;
  privacy?: PostPrivacy;
}

export interface UpdatePostSchema {
  content?: string;
  privacy?: PostPrivacy;
}
