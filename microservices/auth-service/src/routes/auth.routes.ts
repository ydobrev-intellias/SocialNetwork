import Router from 'koa-router';

import { validateSchema } from '../middlewares/validateSchema';
import { signInUser, signUpUser, signOutUser } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { signInSchema, signUpSchema } from '../schemas/authUser.schema';

const router = new Router();

router.get('/validate', validateRequest);

router.post('/sign-up', validateSchema(signUpSchema), signUpUser);

router.post('/sign-in', validateSchema(signInSchema), signInUser);

router.post('/sign-out', signOutUser);

export default router;
