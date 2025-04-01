import { Context } from 'koa';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import { FindOptionsWhere, ILike } from 'typeorm';
import { Role } from '../types/user';

export const searchUsers = async (ctx: Context) => {
  const { query, role } = ctx.query;

  const userRepository = AppDataSource.getRepository(User);

  const whereConditions: FindOptionsWhere<User> = {};

  if (query && !Array.isArray(query)) {
    whereConditions.username = ILike(`%${query}%`);
  }

  if (role && !Array.isArray(role)) {
    whereConditions.role = role as Role;
  }

  const users = await userRepository.find({
    where: whereConditions,
  });

  return users;
};
