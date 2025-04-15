import { AuthUser } from '../entities/AuthUser';
import bcrypt from 'bcryptjs';
import { config } from '../../config';
import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import redis from '../redis/client';
import axios from 'axios';

export const signUp = async (ctx: Context) => {
  const body = ctx.request.body as AuthUser;
  const authRepository = AppDataSource.getRepository(AuthUser);

  const existingUser = await authRepository.findOneBy({ email: body.email });

  if (existingUser) {
    ctx.throw(400, 'User already exists!');
  }

  const hashedPassword = await bcrypt.hash(body.password, config.saltRounds);
  const newAuthUser = authRepository.create({
    email: body.email,
    username: body.username,
    password: hashedPassword,
    role: body.role ?? undefined,
  });

  await authRepository.save(newAuthUser);

  const { password, ...newAuthUserWithoutPassword } = newAuthUser;

  await axios.post(`${config?.userServiceUrl}/`, newAuthUser, { withCredentials: true });

  const token = jwt.sign(
    {
      ...newAuthUserWithoutPassword,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiration,
    },
  );

  ctx.cookies.set('jwt', token, {
    maxAge: config.cookieMaxAge,
    httpOnly: true,
  });

  return { ...newAuthUserWithoutPassword };
};

export const signIn = async (ctx: Context) => {
  const body = ctx.request.body as AuthUser;
  const authRepository = AppDataSource.getRepository(AuthUser);

  const existingUser = await authRepository.findOneBy({ email: body.email });

  if (!existingUser) {
    ctx.throw(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(body.password, existingUser.password);

  if (!isPasswordValid) {
    ctx.throw(401, 'Invalid credentials');
  }
  const { password, ...existingUserWithoutPassword } = existingUser;

  const token = jwt.sign(
    {
      ...existingUserWithoutPassword,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiration,
    },
  );

  ctx.cookies.set('jwt', token, {
    maxAge: config.cookieMaxAge,
    httpOnly: true,
  });

  return { ...existingUserWithoutPassword };
};

export const signOut = async (ctx: Context) => {
  const token = ctx.cookies.get('jwt');

  const decoded = jwt.verify(token!, config.jwtSecret);

  if (!decoded) {
    ctx.throw(400, 'Invalid token');
  }

  await redis.setex(`blacklisted:${token}`, config.jwtExpiration, token!);

  ctx.cookies.set('jwt', '', {
    maxAge: 0,
  });
  return {};
};

export const deleteAuthUser = async (ctx: Context) => {
  const { userId } = ctx.params;

  const userDataHeader = ctx.headers['x-auth-user-data'];
  if (!userDataHeader) {
    ctx.throw(401, 'Missing authentication data');
  }

  const authRepository = AppDataSource.getRepository(AuthUser);
  const authUser = await authRepository.findOne({ where: { id: userId } });

  if (!authUser) {
    ctx.throw(400, 'Auth user does not exist');
  }

  await authRepository.remove(authUser);
};

export const updateAuthUser = async (ctx: Context) => {
  const body = ctx.request.body as Partial<AuthUser>;
  const { userId } = ctx.params;

  const userDataHeader = ctx.headers['x-auth-user-data'];
  if (!userDataHeader) {
    ctx.throw(401, 'Missing authentication data');
  }

  const authRepository = AppDataSource.getRepository(AuthUser);
  const authUser = await authRepository.findOne({ where: { id: userId } });
  if (!authUser) {
    ctx.throw(400, 'Auth user does not exist');
  }

  Object.assign(authUser, body);

  await authRepository.save(authUser);
};
