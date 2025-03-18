import Router from 'koa-router';
import {
  deleteUserContact,
  getUserContact,
  updateUserContact,
} from '../controllers/contact.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { createContactSchema, updateContactSchema } from '../schemas/contact.schema';

const router = new Router();

router.post('/:userId/contacts', validateSchema(createContactSchema), getUserContact);
router.delete('/:userId/contacts/:contactId', deleteUserContact);
router.patch(
  '/:userId/contacts/:contactId',
  validateSchema(updateContactSchema),
  updateUserContact,
);

export default router;
