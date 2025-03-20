import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Like } from '../entities/Like';
import { Post } from '../entities/Post';

export const likePost = async (ctx: Context) => {
  const { postId } = ctx.params;
  const { id: userId } = JSON.parse(ctx.headers['x-auth-user-data'] as string);

  const postRepository = AppDataSource.getRepository(Post);
  let post = await postRepository.findOne({
    where: { id: postId },
    relations: ['originalPost'],
  });

  if (!post) {
    ctx.status = 404;
    ctx.body = { message: `Post with ID ${postId} not found` };
    return;
  }

  if (post.isRepost && post.originalPost) {
    post = post.originalPost;
  }

  const likeRepository = AppDataSource.getRepository(Like);

  const existingLike = await likeRepository.findOne({
    where: { post: { id: post.id }, userId },
  });

  if (existingLike) {
    ctx.status = 400;
    ctx.body = { message: `User with ID ${userId} has already liked this post` };
    return;
  }

  const like = likeRepository.create({ post, userId });
  await likeRepository.save(like);

  ctx.status = 201;
  ctx.body = like;
};

export const unlikePost = async (ctx: Context) => {
  const { likeId } = ctx.params;

  const likeRepository = AppDataSource.getRepository(Like);
  const like = await likeRepository.findOne({ where: { id: likeId } });

  if (!like) {
    ctx.status = 404;
    ctx.body = { message: `Like with ID ${likeId} not found` };
    return;
  }

  await likeRepository.delete({ id: likeId });

  ctx.status = 204;
  ctx.body = '';
};
