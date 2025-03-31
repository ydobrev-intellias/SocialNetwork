import { Post } from './post';

export interface Comment {
  id: string;
  content: string;
  ownerId: string;
  post: Post | null;
  createdAt: Date;
  updatedAt: Date;
  ownerProfile?: {
    username: string;
    id: string;
    avatarPath: string | null;
  };
}
