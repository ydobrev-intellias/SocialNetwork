import Router from 'koa-router';
import { AppDataSource } from '../data-source';
import { Role, User } from '../entities/User';
import { Contact } from '../entities/Contact';
import {
  deleteUserContact,
  getUserContact,
  updateUserContact,
} from '../controllers/contact.controller';
import { validateSchema } from '../middlewares/validateSchema';
import createContactSchema from '../schemas/createContact.schema';
import updateContactSchema from '../schemas/updateContact.schema';

const router = new Router();

router.post('/:userId/contacts', validateSchema(createContactSchema), getUserContact);
router.delete('/:userId/contacts/:contactId', deleteUserContact);
router.patch(
  '/:userId/contacts/:contactId',
  validateSchema(updateContactSchema),
  updateUserContact,
);

export default router;
