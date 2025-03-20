import { Context } from 'koa';
import { deleteContact, getContact, updateContact } from '../services/contact.service';

export const getContactController = async (ctx: Context) => {
  await getContact(ctx);
};

export const deleteContactController = async (ctx: Context) => {
  await deleteContact(ctx);
};

export const updateContactController = async (ctx: Context) => {
  await updateContact(ctx);
};
