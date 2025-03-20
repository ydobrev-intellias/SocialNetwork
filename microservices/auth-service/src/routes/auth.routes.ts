import Router from 'koa-router';

import { validateSchema } from '../middlewares/validateSchema';
import {
  signInController,
  signUpController,
  signOutController,
} from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { signInSchema, signUpSchema } from '../schemas/authUser.schema';

const router = new Router();

router.get('/validate', validateRequest);

router.post('/sign-up', validateSchema(signUpSchema), signUpController);

router.post('/sign-in', validateSchema(signInSchema), signInController);

router.post('/sign-out', signOutController);

export default router;
