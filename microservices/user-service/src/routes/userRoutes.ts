import Router from 'koa-router';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import { config } from '../../config';

const router = new Router({
  prefix: '/users',
});

router.post('/sign-up', async (ctx) => {
  const { username, password } = ctx.request.body as User;

  const userRepository = AppDataSource.getRepository(User);
  const existingUser = await userRepository.findOneBy({ username });
  if (existingUser) {
    ctx.body = 'User already exists!';
    return;
  }
  const hashedPassword = await bcrypt.hash(password, config.saltRounds);
  const newUser = userRepository.create({ username, password: hashedPassword });
  await userRepository.save(newUser);

  ctx.body = 'User signed up';
});

router.post('/sign-in', async (ctx) => {
  const { username, password } = ctx.request.body as User;

  const userRepository = AppDataSource.getRepository(User);
  const existingUser = await userRepository.findOneBy({ username });
  if (!existingUser) {
    ctx.body = 'User does not exist!';
    return;
  }

  if (!(await bcrypt.compare(password, existingUser.password))) {
    ctx.body = 'Password is wrong!';
    return;
  }
  ctx.body = 'User signed in';
});

export default router;
