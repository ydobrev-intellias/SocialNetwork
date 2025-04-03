import { Context } from 'koa';
import { Post } from '../entities/Post';
import { AppDataSource } from '../data-source';
import { ILike } from 'typeorm';
import axios from 'axios';
import { config } from '../../config';
import { PostWithOwnerProfile } from '../types/post';
import { PostPrivacy } from '../types/common';

export const searchPosts = async (ctx: Context) => {
  const { query } = ctx.query;

  const userDataHeader = ctx.headers['x-auth-user-data'];
  const postRepository = AppDataSource.getRepository(Post);
  let posts: Array<PostWithOwnerProfile> = [];

  if (query && !Array.isArray(query)) {
    if (!userDataHeader) {
      posts = await postRepository.find({
        where: { content: ILike(`%${query}%`), privacy: PostPrivacy.PUBLIC },
      });
      for (let post of posts) {
        const ownerProfileResponse = await axios.get(`${config?.userServiceUrl}/${post?.ownerId}`, {
          withCredentials: true,
        });
        post.ownerProfile = ownerProfileResponse.data;
      }
    } else {
      const { id: userId, role } = JSON.parse(ctx.headers['x-auth-user-data'] as string);
      if (role === 'admin') {
        posts = await postRepository.find({
          where: { content: ILike(`%${query}%`) },
        });
      } else {
        posts = await postRepository.find({
          where: [
            { content: ILike(`%${query}%`), privacy: PostPrivacy.PUBLIC },
            { content: ILike(`%${query}%`), privacy: PostPrivacy.PRIVATE, ownerId: userId },
            { content: ILike(`%${query}%`), privacy: PostPrivacy.FOLLOWERS },
          ],
        });
      }
      posts = await Promise.all(
        posts.map(async (post: any) => {
          try {
            const ownerProfileResponse = await axios.get(
              `${config.userServiceUrl}/${post.ownerId}`,
              {
                withCredentials: true,
              },
            );

            console.log('OwnerProfileResponse', ownerProfileResponse.data);

            const isFollower = ownerProfileResponse.data.followers?.some(
              (follow: any) => follow.follower.id === userId,
            );

            console.log('isFollower', isFollower);

            if (
              post.privacy === PostPrivacy.FOLLOWERS &&
              post.ownerId !== userId &&
              !isFollower &&
              role !== 'admin'
            ) {
              return null;
            }

            post.ownerProfile = ownerProfileResponse.data;

            if (post.isRepost && post.originalPost) {
              const repostOwnerProfileResponse = await axios.get(
                `${config.userServiceUrl}/${post.originalPost.ownerId}`,
                { withCredentials: true },
              );
              post.originalPost.ownerProfile = repostOwnerProfileResponse.data;
            }

            return post;
          } catch (error) {
            console.error(`Error fetching profile for user ${post.ownerId}:`, error);
            return null;
          }
        }),
      );

      posts = posts.filter((post: any) => post !== null);
    }
  }

  return posts;
};
