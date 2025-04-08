import { Context } from 'koa';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getProfile,
  updateUser,
  uploadAvatar,
  uploadCover,
} from '../services/user.service';

export const getProfileController = async (ctx: Context) => {
  const profile = await getProfile(ctx);

  ctx.status = 200;
  ctx.body = profile;
};
export const getAllUsersController = async (ctx: Context) => {
  const users = await getAllUsers();
  ctx.status = 200;
  ctx.body = users;
};

export const uploadAvatarController = async (ctx: Context) => {
  const result = await uploadAvatar(ctx);

  ctx.status = 200;
  ctx.body = result;
};

export const uploadCoverController = async (ctx: Context) => {
  const result = await uploadCover(ctx);

  ctx.status = 200;
  ctx.body = result;
};

export const createUserController = async (ctx: Context) => {
  const user = await createUser(ctx);

  ctx.status = 200;
  ctx.body = user;
};

export const updateUserController = async (ctx: Context) => {
  const user = await updateUser(ctx);

  ctx.status = 200;
  ctx.body = user;
};

export const deleteUserController = async (ctx: Context) => {
  await deleteUser(ctx);

  ctx.status = 200;
  ctx.body = {};
};
