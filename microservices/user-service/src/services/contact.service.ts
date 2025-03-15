import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Contact } from '../entities/Contact';
import { Role, User } from '../entities/User';

export const getContact = async (ctx: Context) => {
  const { type, value } = ctx.request.body as Contact;
  const { userId } = ctx.params;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    return;
  }

  const contactRepository = AppDataSource.getRepository(Contact);
  const newContact = contactRepository.create({ type, value, user });
  await contactRepository.save(newContact);
};
export const deleteContact = async (ctx: Context) => {
  const { userId, contactId } = ctx.params;
  const contactRepository = AppDataSource.getRepository(Contact);
  const contact = await contactRepository.findOne({
    where: { id: contactId },
    relations: { user: true },
  });

  if (!contact) {
    ctx.status = 404;
    ctx.body = `Contact with id ${contactId} does not exist`;
    return;
  }

  if (contact.user.id !== userId) {
    ctx.status = 403;
    ctx.body = 'You do not have permission to take this action';
    return;
  }

  await contactRepository.delete({ id: contactId });

  ctx.status = 204;
  ctx.body = 'Deleted successfully';
};
export const updateContact = async (ctx: Context) => {
  const { contactId } = ctx.params;
  const contactRepository = AppDataSource.getRepository(Contact);
  const contact = await contactRepository.findOne({
    where: { id: contactId },
    relations: { user: true },
  });

  if (!contact) {
    ctx.status = 404;
    ctx.body = `Contact with id ${contactId} does not exist`;
    return;
  }

  if (contact.user.id !== ctx.state.user && ctx.state.user.role !== Role.ADMIN) {
    ctx.status = 403;
    ctx.body = 'You do not have permission to take this action';
    return;
  }

  await contactRepository.delete({ id: contactId });

  ctx.status = 200;
  ctx.body = 'Updated successfully';
};
