import { Context } from 'koa';
import { signUp, signIn, signOut } from '../services/auth.service';

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
