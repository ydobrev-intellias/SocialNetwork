import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Contact } from '../entities/Contact';
import { Role, User } from '../entities/User';

export const getContact = async (ctx: Context) => {
  const { userId } = ctx.params;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    return;
  }

  const { type, value } = ctx.request.body as Contact;
  const contactRepository = AppDataSource.getRepository(Contact);
  const newContact = contactRepository.create({ type, value, user });
  return await contactRepository.save(newContact);
};

export const deleteContact = async (ctx: Context) => {
  const { userId, contactId } = ctx.params;
  const contactRepository = AppDataSource.getRepository(Contact);
  const contact = await contactRepository.findOne({
    where: { id: contactId },
    relations: { user: true },
  });

  if (!contact) {
    ctx.throw(404, `Contact with id ${contactId} does not exist`);
  }

  if (contact.user.id !== userId) {
    ctx.throw(403, 'You do not have permission to take this action');
  }

  await contactRepository.delete({ id: contactId });
};

export const updateContact = async (ctx: Context) => {
  const { contactId } = ctx.params;
  const contactRepository = AppDataSource.getRepository(Contact);
  const contact = await contactRepository.findOne({
    where: { id: contactId },
    relations: { user: true },
  });

  if (!contact) {
    ctx.throw(404, `Contact with id ${contactId} does not exist`);
  }

  if (contact.user.id !== ctx.state.user.id && ctx.state.user.role !== Role.ADMIN) {
    ctx.throw(403, 'You do not have permission to take this action');
  }

  const { type, value } = ctx.request.body as Contact;
  contact.type = type;
  contact.value = value;
  return await contactRepository.save(contact);
};

export const createContact = async (ctx: Context) => {
  const { type, value } = ctx.request.body as Contact;

  const contactRepository = AppDataSource.getRepository(Contact);
  const contact = await contactRepository.create({ type, value });

  return contact;
};
