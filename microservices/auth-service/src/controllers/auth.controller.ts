import { Context } from 'koa';
import { signUp, signIn, signOut } from '../services/auth.service';
import { AuthUser } from '../entities/AuthUser';

export const signUpController = async (ctx: Context) => {
  const body = ctx.request.body as AuthUser;
  await signUp(ctx, body);
};

export const signInController = async (ctx: Context) => {
  const body = ctx.request.body as AuthUser;
  await signIn(ctx, body);
};

export const signOutController = async (ctx: Context) => {
  await signOut(ctx);
};
