import Router from 'koa-router';
import {
  deleteContactController,
  getContactController,
  updateContactController,
} from '../controllers/contact.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { createContactSchema, updateContactSchema } from '../schemas/contact.schema';

const router = new Router();

router.post('/:userId/contacts', validateSchema(createContactSchema), getContactController);
router.delete('/:userId/contacts/:contactId', deleteContactController);
router.patch(
  '/:userId/contacts/:contactId',
  validateSchema(updateContactSchema),
  updateContactController,
);

export default router;
