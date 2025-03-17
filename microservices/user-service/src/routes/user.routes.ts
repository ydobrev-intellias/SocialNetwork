import Router from 'koa-router';

import { getUserProfile, uploadUserAvatar, uploadUserCover } from '../controllers/user.controller';
import koaBody from 'koa-body';
import path from 'path';

const router = new Router();

const uploadDir = path.join(__dirname, '../../uploads');

router.get('/:userId/profile', getUserProfile);
router.post(
  '/:userId/avatar',
  koaBody({
    multipart: true,
    formidable: {
      uploadDir,
      keepExtensions: true,
    },
  }),
  uploadUserAvatar,
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
  uploadUserCover,
);

export default router;
