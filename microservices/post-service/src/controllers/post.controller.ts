import { Context } from 'koa';
import {
  createPost,
  deletePost,
  getPost,
  getActivityWall,
  updatePost,
  createRepost,
  deleteUserActivity,
} from '../services/post.service';

export const createPostController = async (ctx: Context) => {
  const post = await createPost(ctx);
  ctx.status = 201;
  ctx.body = post;
};
export const deletePostController = async (ctx: Context) => {
  await deletePost(ctx);
  ctx.status = 200;
  ctx.body = {};
};
export const updatePostController = async (ctx: Context) => {
  const post = await updatePost(ctx);
  ctx.status = 200;
  ctx.body = post;
};
export const getPostController = async (ctx: Context) => {
  const post = await getPost(ctx);
  ctx.status = 200;
  ctx.body = post;
};
export const getActivityWallController = async (ctx: Context) => {
  const posts = await getActivityWall(ctx);
  ctx.status = 200;
  ctx.body = posts;
};
export const createRepostController = async (ctx: Context) => {
  const repost = await createRepost(ctx);
  ctx.body = 201;
  ctx.body = repost;
};

export const deleteUserActivityController = async (ctx: Context) => {
  await deleteUserActivity(ctx);
  ctx.body = 200;
  ctx.body = {};
};
