import Router from 'koa-router';

import authUserSchema from '../schemas/authUser.schema';
import { validateSchema } from '../middlewares/validateSchema';
import { signInUser, signUpUser, signOutUser } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';

const router = new Router();

router.get('/validate', validateRequest);

router.post('/sign-up', validateSchema(authUserSchema), signUpUser);

router.post('/sign-in', validateSchema(authUserSchema), signInUser);

router.post('/sign-out', signOutUser);

export default router;
