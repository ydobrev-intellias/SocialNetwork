import { Context } from 'koa';
import { getProfile, uploadAvatar, uploadCover } from '../services/user.service';

export const getUserProfile = async (ctx: Context) => {
  await getProfile(ctx);
};

export const uploadUserAvatar = async (ctx: Context) => {
  await uploadAvatar(ctx);
};
export const uploadUserCover = async (ctx: Context) => {
  await uploadCover(ctx);
};
