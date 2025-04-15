import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Follow } from '../entities/Follow';
import { produceMessages } from '../rabbitmq/producer';

export const follow = async (ctx: Context) => {
  const { userId } = ctx.params;
  const userHeaders = ctx.headers['x-auth-user-data'];
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    ctx.throw(400, 'User does not exist');
  }
  if (!userHeaders) {
    ctx.throw(401, 'Unauthorized');
  }
  const { id: followerId } = JSON.parse(userHeaders as string);

  if (followerId === userId) {
    ctx.throw(403, 'Forbidden from following yourself');
  }

  const followRepository = AppDataSource.getRepository(Follow);
  const existingFollow = await followRepository.findOne({
    where: { follower: { id: followerId }, following: { id: userId } },
  });

  if (existingFollow) {
    ctx.throw(400, 'You are already following this user');
  }
  const followerUser = await userRepository.findOne({ where: { id: followerId } });
  if (!followerUser) {
    ctx.throw(400, 'Follower does not exist');
  }

  const follow = new Follow();

  follow.follower = followerUser;
  follow.following = user;

  await followRepository.save(follow);

  produceMessages('ownerNotifications', {
    content: `${followerUser.username} started following you`,
    targetId: followerUser.id,
    ownerId: userId,
    createdAt: new Date(),
  });
};

export const unfollow = async (ctx: Context) => {
  const { userId } = ctx.params;
  const userHeaders = ctx.headers['x-auth-user-data'];

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    ctx.throw(400, 'User does not exist');
  }
  if (!userHeaders) {
    ctx.throw(401, 'Unauthorized');
  }
  const { id: followerId } = JSON.parse(userHeaders as string);

  if (followerId === userId) {
    ctx.throw(403, 'Forbidden from unfollowing yourself');
  }
  const followerUser = await userRepository.findOne({ where: { id: followerId } });
  if (!followerUser) {
    ctx.throw(404, 'Follower does not exist');
  }

  const followRepository = AppDataSource.getRepository(Follow);
  const existingFollow = await followRepository.findOne({
    where: { follower: { id: followerId }, following: { id: userId } },
  });

  if (!existingFollow) {
    ctx.throw(400, 'You are not following this user');
  }

  await followRepository.remove(existingFollow);

  produceMessages('ownerNotifications', {
    content: `${followerUser.username} stopped following you`,
    targetId: followerUser.id,
    ownerId: userId,
    createdAt: new Date(),
  });
};
