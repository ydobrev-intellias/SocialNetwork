import { Context } from 'koa';
import { deleteContact, getContact, updateContact } from '../services/contact.service';

export const getUserContact = async (ctx: Context) => {
  await getContact(ctx);
};

export const deleteUserContact = async (ctx: Context) => {
  await deleteContact(ctx);
};

export const updateUserContact = async (ctx: Context) => {
  await updateContact(ctx);
};
