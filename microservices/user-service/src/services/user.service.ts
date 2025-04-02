import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { FileSuffix } from '../utils/generateFilename';
import { uploadFile } from '../utils/uploadFile';
import fs from 'fs/promises';
import axios from 'axios';
import { config } from '../../config';
import { Role } from '../types/user';

export const getProfile = async (ctx: Context) => {
  const { userId } = ctx.params;
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { id: userId },
    relations: {
      contacts: true,
      followers: { follower: true },
      following: { following: true },
    },
  });

  if (!user) {
    ctx.throw(403, `User with id ${userId} does not exist`);
  }

  return user;
};

export const uploadAvatar = async (ctx: Context) => {
  const { userId } = ctx.params;
  const { files } = ctx.request as any;

  if (!files || !files.avatar) {
    ctx.throw(400, 'No file uploaded');
  }

  const avatar = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    await fs.unlink(avatar.filepath);
    ctx.throw(404, 'User does not exist');
  }

  const suffix = FileSuffix.AVATAR;
  const ext = avatar.filepath.split('.').pop() as string;
  const path = await uploadFile(avatar.filepath, suffix, user.id, ext);

  user.avatarPath = path;
  await userRepository.save(user);

  return { path };
};

export const uploadCover = async (ctx: Context) => {
  const { userId } = ctx.params;
  const { files } = ctx.request as any;

  if (!files || !files.cover) {
    ctx.throw(400, 'No file uploaded');
  }

  const cover = Array.isArray(files.cover) ? files.cover[0] : files.cover;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    await fs.unlink(cover.filepath);
    ctx.throw(404, 'User does not exist');
  }

  const suffix = FileSuffix.COVER;
  const ext = cover.filepath.split('.').pop() as string;
  const path = await uploadFile(cover.filepath, suffix, user.id, ext);

  user.coverPath = path;
  await userRepository.save(user);

  return { path };
};

export const createUser = async (ctx: Context) => {
  const body = ctx.request.body as User;
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.create(body);
  return await userRepository.save(user);
};

export const deleteUser = async (ctx: Context) => {
  const { userId } = ctx.params;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });

  const userHeaders = ctx.headers['x-auth-user-data'];

  if (!user) {
    ctx.throw(400, 'User does not exist');
  }
  if (!userHeaders) {
    ctx.throw(401, 'Unauthorized');
  }
  const { id: tokenUserId, role } = JSON.parse(userHeaders as string);
  if (tokenUserId !== userId && role !== Role.ADMIN) {
    ctx.throw(403, 'Forbidden from deleting user');
  }
  await axios.delete(`${config.authServiceUrl}/users/${userId}`, {
    headers: {
      Cookie: ctx.headers.cookie,
      'X-Auth-User-Data': userHeaders,
    },

    withCredentials: true,
  });

  await axios.delete(`${config.postServiceUrl}/activity/${userId}`, {
    headers: {
      Cookie: ctx.headers.cookie,
      'X-Auth-User-Data': userHeaders,
    },
    withCredentials: true,
  });

  await userRepository.remove(user);
};

export const updateUser = async (ctx: Context) => {
  const body = ctx.request.body as Partial<User>;
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
  const { id: tokenUserId, role } = JSON.parse(userHeaders as string);
  if (tokenUserId !== userId && role !== Role.ADMIN) {
    ctx.throw(403, 'Forbidden from updating user');
  }
  Object.assign(user, body);

  await axios.patch(`${config.authServiceUrl}/users/${userId}`, body, {
    headers: { Cookie: ctx.headers.cookie, 'X-Auth-User-Data': userHeaders },
    withCredentials: true,
  });

  return await userRepository.save(user);
};
