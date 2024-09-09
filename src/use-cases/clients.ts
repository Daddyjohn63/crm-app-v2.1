//business logic
//make sure there is a session
//call create event
//handle errors
//when it comes to editing , I need to make sure that the user is entitled to edit that client
import { ClientId, NewClientInput, NewClient } from '@/db/schema';
import { UserSession } from './types';
import {
  createClient,
  getClientById,
  getClientsByUser,
  searchClientsByName
} from '@/data-access/clients';
import { NotFoundError } from '@/app/util';

//authenticatedUser will be passed when we create the server action and zsa.

export async function createClientUseCase(
  authenticatedUser: UserSession,
  newClient: NewClient
) {
  await createClient({ ...newClient, userId: authenticatedUser.id });
}

export async function getClientsUseCase(authenticatedUser: UserSession) {
  return [...(await getClientsByUser(authenticatedUser.id))];
}

export async function searchClientsUseCase(
  user: UserSession,
  search: string,
  page: number
) {
  return await searchClientsByName(user.id, search, page);
}

export async function getClientByIdUseCase(
  user: UserSession,
  clientId: ClientId
) {
  const client = await getClientById(user.id, clientId);

  if (!client) {
    throw new NotFoundError('Client not found');
  }

  return client;
}
