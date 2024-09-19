import { database } from '@/db/drizzle';
import {
  Client,
  ClientId,
  NewClient,
  clients,
  contacts,
  ContactId,
  NewContact,
  Contact,
  User
} from '@/db/schema';
import { asc, eq, ilike, sql, and, inArray } from 'drizzle-orm';
import { UserId, UserSession } from '@/use-cases/types';
import { NotFoundError } from '@/app/util';

//createContact must save the contact information in the database and make a reference to the client in the contacts table

export async function createContact(newContact: NewContact) {
  //console.log('newContact', newContact);
  return await database.insert(contacts).values(newContact);
}

export async function getContactsByClientId(
  clientId: ClientId,
  user: UserSession
): Promise<Contact[]> {
  // Check if the user has access to the client
  const client: Client | undefined = await database.query.clients.findFirst({
    where: and(eq(clients.id, clientId), eq(clients.userId, user.id))
  });

  if (!client) {
    throw new NotFoundError('Client not found or access denied');
  }

  const clientContacts: Contact[] = await database.query.contacts.findMany({
    where: eq(contacts.clientId, clientId)
  });
  //console.log('clientContacts', clientContacts);
  //return clientContacts;
  const formattedContacts = clientContacts.map(contact => ({
    id: contact.id,
    last_name: contact.last_name,
    first_name: contact.first_name,
    job_title: contact.job_title,
    email: contact.email,
    phone: contact.phone,
    address: `${contact.address}, ${contact.city},${contact.county}, ${contact.postcode}`,
    city: contact.city,
    county: contact.county,
    postcode: contact.postcode,
    country: contact.country,
    clientId: contact.clientId
  }));
  return formattedContacts;
}

export async function deleteContacts(
  contactIds: ContactId[],
  user: UserSession,
  clientId: ClientId
) {
  // console.log('contactIds-db', contactIds);
  // console.log('user-db', user);
  // console.log('clientId-db', clientId);
  // Check if the user has access to the client
  const client: Client | undefined = await database.query.clients.findFirst({
    where: and(eq(clients.id, clientId), eq(clients.userId, user.id))
  });

  if (!client) {
    throw new NotFoundError('Client not found or access denied');
  }
  return await database
    .delete(contacts)
    .where(inArray(contacts.id, contactIds));
}

export async function editContact(
  contactId: ContactId,
  updatedContact: NewContact
) {
  return await database
    .update(contacts)
    .set(updatedContact)
    .where(eq(contacts.id, contactId));
}

export async function getContactById(contactId: ContactId) {
  return await database.query.contacts.findFirst({
    where: eq(contacts.id, contactId)
  });
}
