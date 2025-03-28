import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Like } from '../entities/Like';
import { Post } from '../entities/Post';

export const likePost = async (ctx: Context) => {
  const { postId } = ctx.params;

  const userDataHeader = ctx.headers['x-auth-user-data'];
  if (!userDataHeader) {
    ctx.throw(400, 'Missing authentication data');
  }

  let userId: string;
  try {
    const userData = JSON.parse(userDataHeader as string);
    userId = userData.id;
  } catch (error) {
    ctx.throw(400, 'Invalid authentication data');
  }

  const postRepository = AppDataSource.getRepository(Post);
  let post = await postRepository.findOne({
    where: { id: postId },
    relations: ['originalPost'],
  });

  if (!post) {
    ctx.throw(404, `Post with ID ${postId} not found`);
  }

  if (post.isRepost && post.originalPost) {
    post = post.originalPost;
  }

  const likeRepository = AppDataSource.getRepository(Like);
  const existingLike = await likeRepository.findOne({
    where: {
      post: { id: post.id },
      userId,
    },
  });

  if (existingLike) {
    ctx.throw(400, `User with ID ${userId} has already liked this post`);
  }

  const like = likeRepository.create({ post, userId });
  await likeRepository.save(like);

  return like;
};

export const unlikePost = async (ctx: Context) => {
  const { likeId } = ctx.params;

  const likeRepository = AppDataSource.getRepository(Like);
  const like = await likeRepository.findOne({ where: { id: likeId } });

  if (!like) {
    ctx.throw(404, `Like with ID ${likeId} not found`);
  }

  await likeRepository.delete({ id: likeId });
};
