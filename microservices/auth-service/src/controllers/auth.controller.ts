import { Context } from 'koa';
import { signUp, signIn, signOut, updateAuthUser, deleteAuthUser } from '../services/auth.service';

export const signUpController = async (ctx: Context) => {
  const result = await signUp(ctx);

  ctx.status = 202;
  ctx.body = result;
};

export const signInController = async (ctx: Context) => {
  const result = await signIn(ctx);

  ctx.status = 202;
  ctx.body = result;
};

export const signOutController = async (ctx: Context) => {
  const result = await signOut(ctx);

  ctx.status = 200;
  ctx.body = result;
};
export const updateAuthUserController = async (ctx: Context) => {
  const result = await updateAuthUser(ctx);
  ctx.status = 200;
  ctx.body = result;
};

export const deleteAuthUserController = async (ctx: Context) => {
  await deleteAuthUser(ctx);
  ctx.status = 200;
  ctx.body = {};
};
