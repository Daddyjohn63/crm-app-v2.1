import { database } from '@/db/drizzle';
import {
  Client,
  ClientId,
  NewClient,
  clients,
  contacts,
  ContactId,
  NewContact,
  Contact
} from '@/db/schema';
import { asc, eq, ilike, sql, and } from 'drizzle-orm';
import { UserId } from '@/use-cases/types';
import { NotFoundError } from '@/app/util';

//createContact must save the contact information in the database and make a reference to the client in the contacts table

export async function createContact(newContact: NewContact) {
  //console.log('newContact', newContact);
  return await database.insert(contacts).values(newContact);
}

export async function getContactsByClientId(
  clientId: ClientId
): Promise<Contact[]> {
  const clientContacts: Contact[] = await database.query.contacts.findMany({
    where: eq(contacts.clientId, clientId)
  });
  console.log('clientContacts', clientContacts);
  return clientContacts;
}
