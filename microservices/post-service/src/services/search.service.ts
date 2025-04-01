import { Context } from 'koa';
import { Post } from '../entities/Post';
import { AppDataSource } from '../data-source';
import { ILike } from 'typeorm';
import axios from 'axios';
import { config } from '../../config';
import { PostWithOwnerProfile } from '../types/post';

export const searchPosts = async (ctx: Context) => {
  const { query, role } = ctx.query;

  const postRepository = AppDataSource.getRepository(Post);

  let posts: Array<PostWithOwnerProfile> = [];
  if (query && !Array.isArray(query)) {
    posts = await postRepository.find({
      where: { content: ILike(`%${query}%`) },
    });

    if (role && !Array.isArray(role)) {
      posts = posts.filter(async (post) => {
        const ownerProfileResponse = await axios.get(`${config?.userServiceUrl}/${post?.ownerId}`, {
          withCredentials: true,
        });
        const ownerProfile = ownerProfileResponse.data;

        return ownerProfile.role === role;
      });
    } else {
      for (let post of posts) {
        const ownerProfileResponse = await axios.get(`${config?.userServiceUrl}/${post?.ownerId}`, {
          withCredentials: true,
        });
        post.ownerProfile = ownerProfileResponse.data;
      }
    }
  }

  return posts;
};
