import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Like } from '../entities/Like';
import { Post } from '../entities/Post';
import { produceMessages } from '../rabbitmq/producer';

export const likePost = async (ctx: Context) => {
  const { postId } = ctx.params;

  const userDataHeader = ctx.headers['x-auth-user-data'];
  if (!userDataHeader) {
    ctx.throw(400, 'Missing authentication data');
  }

  let userId: string, username: string;
  try {
    const userData = JSON.parse(userDataHeader as string);
    userId = userData.id;
    username = userData.username;
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

  produceMessages('ownerNotifications', {
    content: `${username} liked this post`,
    targetId: post.id,
    ownerId: post.ownerId,
    createdAt: new Date(),
  });
  return like;
};

export const unlikePost = async (ctx: Context) => {
  const { likeId } = ctx.params;

  const likeRepository = AppDataSource.getRepository(Like);
  const like = await likeRepository.findOne({ where: { id: likeId }, relations: { post: true } });

  if (!like) {
    ctx.throw(404, `Like with ID ${likeId} not found`);
  }
  const userDataHeader = ctx.headers['x-auth-user-data'];
  if (!userDataHeader) {
    ctx.throw(400, 'Missing authentication data');
  }

  await likeRepository.delete({ id: likeId });
};
