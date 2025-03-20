import { Context } from 'koa';
import {
  createPost,
  deletePost,
  getPost,
  getActivityWall,
  updatePost,
  createRepost,
} from '../services/post.service';

export const createPostController = async (ctx: Context) => {
  await createPost(ctx);
};
export const deletePostController = async (ctx: Context) => {
  await deletePost(ctx);
};
export const updatePostController = async (ctx: Context) => {
  await updatePost(ctx);
};
export const getPostController = async (ctx: Context) => {
  await getPost(ctx);
};
export const getActivityWallController = async (ctx: Context) => {
  await getActivityWall(ctx);
};
export const createRepostController = async (ctx: Context) => {
  await createRepost(ctx);
};
