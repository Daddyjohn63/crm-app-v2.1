import { ClientId, NewContact, ContactId, Contact } from '@/db/schema';
import { UserSession } from './types';

import { AuthenticationError, NotFoundError } from '@/app/util';
import { getClientByClientId, getClientById } from '@/data-access/clients';
import { PublicError } from './errors';
import {
  createContact,
  deleteContacts,
  editContact,
  getContactById,
  getContactsByClientId
} from '@/data-access/contacts';

export async function createContactUseCase(
  authenticatedUser: UserSession,
  { clientId, ...rest }: NewContact
) {
  if (clientId === undefined) {
    throw new PublicError('Client ID is required');
  }
  const client = await getClientByClientId(clientId);
  if (!client) {
    throw new PublicError('Client not found');
  }

  await createContact({
    clientId,
    ...rest
  });
}

export async function getContactsByClientIdUseCase(
  user: UserSession,
  clientId: ClientId
) {
  const contacts = await getContactsByClientId(clientId, user);
  return contacts;
}

export async function deleteContactsUseCase(
  user: UserSession,
  clientId: ClientId,
  contactIds: ContactId[]
) {
  console.log('user-uc', user);
  console.log('clientId-uc', clientId);
  console.log('contactIds-uc', contactIds);
  if (!user) {
    throw new NotFoundError('User not authenticated');
  }
  if (!clientId) {
    throw new PublicError('Client ID is required');
  }
  if (!contactIds) {
    throw new PublicError('Contact IDs are required');
  }
  await deleteContacts(contactIds as number[], user as any, clientId as any);
}

export async function editContactUseCase(
  user: UserSession,
  contactId: ContactId,
  { clientId, ...rest }: NewContact
) {
  await editContact(contactId, {
    clientId,
    ...rest
  });
}

export async function getContactByIdUseCase(
  user: UserSession,
  contactId: ContactId
) {
  const contact = await getContactById(contactId);
  return contact;
}
