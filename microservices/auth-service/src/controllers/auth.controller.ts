import { Context } from 'koa';
import { signUp, signIn, signOut } from '../services/auth.service';
import { AuthUser } from '../entities/AuthUser';

export const signUpUser = async (ctx: Context) => {
  const body = ctx.request.body as AuthUser;
  await signUp(ctx, body);
};

export const signInUser = async (ctx: Context) => {
  const body = ctx.request.body as AuthUser;
  await signIn(ctx, body);
};

export const signOutUser = async (ctx: Context) => {
  await signOut(ctx);
};
