import { Context } from 'koa';
import { Post } from '../entities/Post';
import { AppDataSource } from '../data-source';
import { ILike } from 'typeorm';

export const searchPosts = async (ctx: Context) => {
  const { query } = ctx.query;

  const postRepository = AppDataSource.getRepository(Post);

  let posts: Array<Post> = [];
  if (query && !Array.isArray(query)) {
    posts = await postRepository.find({
      where: { content: ILike(`%${query}%`) },
    });
  }

  return posts;
};
