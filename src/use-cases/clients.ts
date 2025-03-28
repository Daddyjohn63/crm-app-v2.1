//business logic
//make sure there is a session
//call create event
//handle errors
//when it comes to editing , I need to make sure that the user is entitled to edit that client
import { ClientId, NewClient, ServicesId } from '@/db/schema/index';
import { SalesStage, SalesStageFilter, UserSession } from './types';
import {
  createClient,
  deleteClient,
  getClientByClientId,
  getClientById,
  getClientsByServiceId,
  getClientsByUser,
  getServiceIdsByClientId,
  getServicesByClientId,
  searchClients,
  updateClient,
  updateClientField,
  updateClientServices
} from '@/data-access/clients';
import { AuthenticationError, NotFoundError } from '@/app/util';
import { omit } from 'lodash';
import { cache } from 'react';

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

export const getClientsUseCase = cache(
  async (authenticatedUser: UserSession) => {
    console.log('Fetching clients for user:', authenticatedUser.id);
    const clients = await getClientsByUser(authenticatedUser.id);
    console.log('Fetched clients count:', clients.length);
    return [...clients];
  }
);

export const searchClientsUseCase = cache(
  async (
    user: UserSession,
    search: string,
    page: number,
    stage?: SalesStageFilter
  ) => {
    console.log('Searching clients:', { userId: user.id, search, page, stage });
    const result = await searchClients(
      user.id,
      search,
      page,
      stage as SalesStage
    );
    console.log('Search results count:', result.data.length);
    return result;
  }
);

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

export async function updateClientServicesUseCase(
  authenticatedUser: UserSession,
  { clientId, serviceIds }: { clientId: number; serviceIds: number[] }
) {
  const existingClient = await getClientById(authenticatedUser.id, clientId);
  if (!existingClient) {
    throw new NotFoundError('Client not found');
  }

  await updateClientServices(authenticatedUser.id, clientId, serviceIds);
}

export async function getServicesByClientIdUseCase(clientId: ClientId) {
  const clientServices = await getServicesByClientId(clientId);
  return clientServices;
}

export async function getClientsByServiceIdUseCase(serviceId: ServicesId) {
  const serviceClients = await getClientsByServiceId(serviceId);
  return serviceClients;
}
