import { Post } from './post';

export interface Like {
  id: string;
  userId: string;
  post: Post | null;
}
