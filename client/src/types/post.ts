import { Comment } from './comment';
import { Like } from './like';

export interface Post {
  id: string;
  content: string;
  ownerId: string;
  mediaPath?: string | null;
  privacy: PostPrivacy;
  likes?: Like[] | null;
  comments?: Comment[] | null;
  originalPost?: Post & {
    ownerProfile?: {
      username: string;
      avatarPath: string;
    };
  };
  ownerProfile?: {
    username: string;
    avatarPath: string;
    id: string;
  };
  reposts?: Post[];
  isRepost: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePost {
  content: string;
  file?: File;
  privacy: PostPrivacy;
}
export interface CreateRepost {
  content: string;
  privacy: PostPrivacy;
}
export type UpdatePost = Partial<CreatePost>;

export enum PostPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface PostData {
  content: string;
  image: string;
  privacy: PostPrivacy;
  id: string;
  mediaPath: string;
}
