import Router from 'koa-router';
import { searchController } from '../controllers/search.controller';

const router = new Router();

router.get('/', searchController);

export default router;
