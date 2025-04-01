import { Post } from '../entities/Post';
import { PostPrivacy } from './common';

export interface CreatePostSchema {
  content: string;
  privacy?: PostPrivacy;
}

export interface UpdatePostSchema {
  content?: string;
  privacy?: PostPrivacy;
}
export type PostWithOwnerProfile = Post & {
  ownerProfile?: { id: string; username: string; email: string; avatarPath: string };
};

export type RepostWithOwnerProfile = Post & {
  ownerProfile?: { id: string; username: string; email: string; avatarPath: string };
  originalPost: PostWithOwnerProfile;
};

export type PostWithNestedOwnerProfile = PostWithOwnerProfile & {
  originalPost?: PostWithOwnerProfile;
};
