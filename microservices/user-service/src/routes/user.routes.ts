import Router from 'koa-router';

import {
  createUserController,
  deleteUserController,
  getProfileController,
  updateUserController,
  uploadAvatarController,
  uploadCoverController,
} from '../controllers/user.controller';
import koaBody from 'koa-body';
import path from 'path';

const router = new Router();

const uploadDir = path.join(__dirname, '../../uploads');

router.post('/', createUserController);
router.patch('/:userId', updateUserController);
router.delete('/:userId', deleteUserController);

router.get('/:userId', getProfileController);
router.post(
  '/:userId/avatar',
  koaBody({
    multipart: true,
    formidable: {
      uploadDir,
      keepExtensions: true,
    },
  }),
  uploadAvatarController,
);

router.post(
  '/:userId/cover',
  koaBody({
    multipart: true,
    formidable: {
      uploadDir,
      keepExtensions: true,
    },
  }),
  uploadCoverController,
);

export default router;
