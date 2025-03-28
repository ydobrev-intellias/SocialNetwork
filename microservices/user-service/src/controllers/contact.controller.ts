import { Context } from 'koa';
import {
  createContact,
  deleteContact,
  getContact,
  updateContact,
} from '../services/contact.service';

export const getContactController = async (ctx: Context) => {
  const contact = await getContact(ctx);
  ctx.status = 200;
  ctx.body = contact;
};

export const deleteContactController = async (ctx: Context) => {
  await deleteContact(ctx);
  ctx.status = 204;
  ctx.body = {};
};

export const createContactController = async (ctx: Context) => {
  const contact = await createContact(ctx);
  ctx.status = 200;
  ctx.body = contact;
};

export const updateContactController = async (ctx: Context) => {
  const contact = await updateContact(ctx);
  ctx.status = 200;
  ctx.body = contact;
};
