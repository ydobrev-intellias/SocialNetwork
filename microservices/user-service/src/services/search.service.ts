import { Context } from 'koa';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import { ILike } from 'typeorm';

export const searchUsers = async (ctx: Context) => {
  const { query } = ctx.query;

  const userRepository = AppDataSource.getRepository(User);

  let users: Array<User> = [];
  if (query && !Array.isArray(query)) {
    users = await userRepository.find({
      where: { username: ILike(`%${query}%`) },
    });
  }

  return users;
};
