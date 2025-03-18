import Router from 'koa-router';

import authUserSchema from '../schemas/authUser.schema';
import { validateSchema } from '../middlewares/validateSchema';
import {
  signInController,
  signUpController,
  signOutController,
} from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';

const router = new Router();

router.get('/validate', validateRequest);

router.post('/sign-up', validateSchema(authUserSchema), signUpController);

router.post('/sign-in', validateSchema(authUserSchema), signInController);

router.post('/sign-out', signOutController);

export default router;
