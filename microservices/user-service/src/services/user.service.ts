import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { FileSuffix } from '../utils/generateFilename';
import { uploadFile } from '../utils/uploadFile';
import fs from 'fs/promises';

export const getProfile = async (ctx: Context) => {
  const { userId } = ctx.params;
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { id: userId },
    relations: { contacts: true },
  });

  if (!user) {
    ctx.status = 403;
    ctx.body = { message: `User with id ${userId} does not exist` };
    return;
  }

  ctx.status = 200;
  ctx.body = user;
};

export const uploadAvatar = async (ctx: Context) => {
  const { userId } = ctx.params;
  const { files } = ctx.request;

  if (!files || !files.avatar) {
    ctx.status = 400;
    ctx.body = { message: 'No file uploaded' };
    return;
  }

  const avatar = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    ctx.status = 404;
    ctx.body = { message: 'User does not exist' };
    await fs.unlink(avatar.filepath);
    return;
  }

  try {
    const suffix = FileSuffix.AVATAR;
    const ext = avatar.filepath.split('.').pop() as string;
    const path = await uploadFile(avatar.filepath, suffix, user.id, ext);

    user.avatarPath = path;
    await userRepository.save(user);

    ctx.status = 200;
    ctx.body = { message: 'Avatar uploaded successfully', path };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    ctx.status = 500;
    ctx.body = { message: 'Error uploading file' };
  }
};

export const uploadCover = async (ctx: Context) => {
  const { userId } = ctx.params;
  const { files } = ctx.request;

  if (!files || !files.cover) {
    ctx.status = 400;
    ctx.body = { message: 'No file uploaded' };
    return;
  }

  const cover = Array.isArray(files.cover) ? files.cover[0] : files.cover;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    ctx.status = 404;
    ctx.body = { message: 'User does not exist' };
    await fs.unlink(cover.filepath);
    return;
  }

  try {
    const suffix = FileSuffix.COVER;
    const ext = cover.filepath.split('.').pop() as string;
    const path = await uploadFile(cover.filepath, suffix, user.id, ext);

    user.coverPath = path;
    await userRepository.save(user);

    ctx.status = 200;
    ctx.body = { message: 'Cover uploaded successfully', path };
  } catch (error) {
    console.error('Error uploading cover:', error);
    ctx.status = 500;
    ctx.body = { message: 'Error uploading file' };
  }
};
