import { ClientId, NewContact, ContactId, Contact } from '@/db/schema';
import { UserSession } from './types';

import { AuthenticationError, NotFoundError } from '@/app/util';
import { getClientByClientId, getClientById } from '@/data-access/clients';
import { PublicError } from './errors';
import { createContact } from '@/data-access/contacts';

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
