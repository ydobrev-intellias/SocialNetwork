import { Comment } from '../entities/Comment';

export interface CreateOrUpdateCommentSchema {
  content: string;
}
export type CommentsWithOwnerProfile = Comment & {
  ownerProfile?: {
    username: string;
    email: string;
    id: string;
    avatarPath: string;
  };
};
