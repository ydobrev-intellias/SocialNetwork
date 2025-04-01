import Router from 'koa-router';
import { searchController } from '../controllers/search.controller';

const router = new Router();

router.get('/search', searchController);

export default router;
