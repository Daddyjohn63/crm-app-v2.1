import { database } from '@/db/drizzle';
import {
  Client,
  ClientId,
  NewClient,
  clients,
  contacts,
  ContactId,
  NewContact
} from '@/db/schema';
import { asc, eq, ilike, sql, and } from 'drizzle-orm';
import { UserId } from '@/use-cases/types';
import { NotFoundError } from '@/app/util';

//createContact must save the contact information in the database and make a reference to the client in the contacts table

export async function createContact(newContact: NewContact) {
  const [contact] = await database
    .insert(contacts)
    .values(newContact)
    .returning();
  return contact;
}
