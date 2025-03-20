import { Context } from 'koa';
import { getProfile, uploadAvatar, uploadCover } from '../services/user.service';

export const getProfileController = async (ctx: Context) => {
  await getProfile(ctx);
};

export const uploadAvatarController = async (ctx: Context) => {
  await uploadAvatar(ctx);
};
export const uploadCoverController = async (ctx: Context) => {
  await uploadCover(ctx);
};
