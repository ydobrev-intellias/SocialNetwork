import { AuthUser } from '../entities/AuthUser';
import bcrypt from 'bcryptjs';
import { config } from '../../config';
import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { publishMessage } from '../rabbitmq/publisher';
import { AppDataSource } from '../data-source';
import redis from '../redis/client';

export const signUp = async (ctx: Context, body: AuthUser) => {
  const authRepository = AppDataSource.getRepository(AuthUser);

  const existingUser = await authRepository.findOneBy({ email: body.email });

  if (existingUser) {
    ctx.status = 400;
    ctx.body = 'User already exists!';
    return;
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

  await publishMessage(
    config.rabbitmqQueueName,
    JSON.stringify({
      data: {
        ...newAuthUserWithoutPassword,
      },
      type: 'USER_SIGNUP',
    }),
  );

  const token = jwt.sign(
    {
      ...newAuthUserWithoutPassword,
    },
    config.jwtSecret,
    {
      expiresIn: '1h',
    },
  );

  ctx.cookies.set('jwt', token, {
    maxAge: 3600000,
  });

  ctx.status = 202;
  ctx.body = newAuthUserWithoutPassword;
};

export const signIn = async (ctx: Context, body: AuthUser) => {
  const authRepository = AppDataSource.getRepository(AuthUser);

  const existingUser = await authRepository.findOneBy({ email: body.email });

  if (!existingUser) {
    ctx.status = 404;
    ctx.body = 'User not found';
    return;
  }

  const isPasswordValid = await bcrypt.compare(body.password, existingUser.password);

  if (!isPasswordValid) {
    ctx.status = 401;
    ctx.body = 'Invalid credentials';
    return;
  }
  const { password, ...existingUserWithoutPassword } = existingUser;

  const token = jwt.sign(
    {
      ...existingUserWithoutPassword,
    },
    config.jwtSecret,
    {
      expiresIn: '1h',
    },
  );

  ctx.cookies.set('jwt', token, {
    maxAge: 3600000,
  });

  ctx.status = 200;
  ctx.body = existingUserWithoutPassword;
};

export const signOut = async (ctx: Context) => {
  const token = ctx.cookies.get('jwt');

  try {
    const decoded = jwt.verify(token!, config.jwtSecret);
    if (!decoded) {
      ctx.status = 400;
      ctx.body = 'Invalid token';
      return;
    }

    await redis.setex(`blacklisted:${token}`, config.jwtExpiration, token!);

    ctx.cookies.set('jwt', '', {
      maxAge: 0,
    });

    ctx.status = 200;
    ctx.body = '';
  } catch (err) {
    ctx.status = 400;
    ctx.body = 'Invalid token';
  }
};
