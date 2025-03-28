export interface CreatePostSchema {
  content: string;
  //   privacy: PostPrivacy;
}

export interface UpdatePostSchema {
  content: string;
}
export enum PostPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
}
