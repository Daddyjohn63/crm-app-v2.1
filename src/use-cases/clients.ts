//business logic
//make sure there is a session
//call create event
//handle errors
//when it comes to editing , I need to make sure that the user is entitled to edit that client
import { ClientId, NewClient } from '@/db/schema';
import { UserSession } from './types';
import {
  createClient,
  deleteClient,
  getClientByClientId,
  getClientById,
  getClientsByUser,
  searchClientsByName,
  updateClient,
  updateClientField
} from '@/data-access/clients';
import { AuthenticationError, NotFoundError } from '@/app/util';
import { omit } from 'lodash';
//authenticatedUser will be passed when we create the server action and zsa.

export async function createClientUseCase(
  authenticatedUser: UserSession,
  newClient: NewClient
) {
  await createClient({ ...newClient, userId: authenticatedUser.id });
}

export async function editClientUseCase(
  authenticatedUser: UserSession,
  clientId: ClientId,
  updatedClient: Partial<Omit<NewClient, 'userId'>>
) {
  const existingClient = await getClientById(authenticatedUser.id, clientId);
  if (!existingClient) {
    throw new NotFoundError('Client not found');
  }
  await updateClient(authenticatedUser.id, clientId, updatedClient);
  return existingClient;
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
    throw new NotFoundError('Client not found!');
  }

  return client;
}

export async function updateClientFieldUseCase(
  user: UserSession,
  clientId: ClientId,
  field: string,
  newValue: string
) {
  // Implement the logic to update the specified field in the database
  // This might involve calling a function from your data access layer
  // For example:
  await updateClientField(user.id, clientId, field, newValue);
  // console.log(
  //   'FROM UPDATE CLIENT FIELD USE CASE',
  //   user,
  //   clientId,
  //   field,
  //   newValue
  // );
}

//checks to ensure that the user is the owner of the client
export async function assertClientOwnership(
  user: UserSession,
  clientId: ClientId
) {
  const client = await getClientById(user.id, clientId);
  if (!client) {
    throw new NotFoundError('Client not found!');
  }
  if (!user) {
    throw new AuthenticationError();
  }
  return client;
}

export async function deleteClientUseCase(
  user: UserSession,
  { clientId }: { clientId: ClientId }
) {
  await assertClientOwnership(user, clientId);
  await deleteClient(clientId);
}

//does client exist
export async function getClientInfoByIdUseCase(clientId: ClientId) {
  const client = await getClientByClientId(clientId);
  if (!client) return undefined;

  return omit(client, 'userId');
}
