export interface CreateCommentSchema {
  content: string;
}

export interface UpdateCommentSchema {
  content: string;
}
export enum PostPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
}
