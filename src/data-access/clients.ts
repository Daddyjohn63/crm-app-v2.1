import { database } from '@/db/drizzle';
import {
  Client,
  ClientId,
  NewClient,
  ServicesId,
  clients,
  services
} from '@/db/schema';
import { asc, eq, ilike, sql, and, desc, inArray } from 'drizzle-orm';
import {
  SALES_STAGE_FILTER_OPTIONS,
  SalesStage,
  SalesStageFilter,
  UserId
} from '@/use-cases/types';
import { NotFoundError } from '@/app/util';
import { clientsToServices } from '@/db/schema';

export async function createClient(newClient: NewClient) {
  const [client] = await database.insert(clients).values(newClient).returning();
  return client;
}

export async function getClientsByUser(userId: UserId) {
  console.log('GET-CLIENTS-BY-USER-CHECK', userId); //yes, userId is correct
  const userClients = await database.query.clients.findMany({
    where: eq(clients.userId, userId),
    orderBy: [desc(clients.id)]
  });
  console.log('FOUND CLIENTS:', userClients);
  return userClients;
}

export async function searchClients(
  userId: UserId,
  search: string,
  page: number,
  stage?: SalesStageFilter
) {
  const CLIENTS_PER_PAGE = 9;

  let conditions = [eq(clients.userId, userId)];

  if (search) {
    conditions.push(ilike(clients.business_name, `%${search}%`));
  }

  if (stage && stage !== SALES_STAGE_FILTER_OPTIONS.ALL) {
    conditions.push(eq(clients.sales_stage, stage as SalesStage));
  }

  const condition = and(...conditions);

  const userClients = await database.query.clients.findMany({
    where: condition,
    limit: CLIENTS_PER_PAGE,
    offset: (page - 1) * CLIENTS_PER_PAGE,
    orderBy: [desc(clients.id)]
  });

  const [countResult] = await database
    .select({
      count: sql`count(*)`.mapWith(Number).as('count')
    })
    .from(clients)
    .where(condition);

  return {
    data: userClients,
    perPage: CLIENTS_PER_PAGE,
    total: countResult.count
  };
}
//old function
// export async function searchClientsByName(
//   userId: UserId,
//   search: string,
//   page: number,
//   stage?: SalesStageFilter
// ) {
//   const CLIENTS_PER_PAGE = 9;

//   const condition = search
//     ? and(
//         eq(clients.userId, userId),
//         ilike(clients.business_name, `%${search}%`)
//       )
//     : eq(clients.userId, userId);

//   const userClients = await database.query.clients.findMany({
//     where: condition,
//     limit: CLIENTS_PER_PAGE,
//     offset: (page - 1) * CLIENTS_PER_PAGE,
//     orderBy: [desc(clients.id)]
//   });

//   const [countResult] = await database
//     .select({
//       count: sql`count(*)`.mapWith(Number).as('count')
//     })
//     .from(clients)
//     .where(condition);

//   return {
//     data: userClients,
//     perPage: CLIENTS_PER_PAGE,
//     total: countResult.count
//   };
// }
//get the client information for a single client
export async function getClientById(userId: UserId, clientId: ClientId) {
  const client = await database.query.clients.findFirst({
    where: and(eq(clients.id, clientId), eq(clients.userId, userId))
  });
  return client ?? null;
}

export async function getClientByClientId(clientId: ClientId) {
  const client = await database.query.clients.findFirst({
    where: eq(clients.id, clientId)
  });
  // console.log('CLIENT', client);
  return client ?? null;
}

export async function updateClientField(
  userId: UserId,
  clientId: ClientId,
  field: string,
  newValue: string
) {
  await database
    .update(clients)
    .set({ [field]: newValue })
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)));
}

export async function updateClient(
  userId: UserId,
  clientId: ClientId,
  updatedClient: Partial<Omit<NewClient, 'userId'>>
) {
  await database
    .update(clients)
    .set(updatedClient)
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)));
}

export async function deleteClient(clientId: ClientId) {
  await database.delete(clients).where(eq(clients.id, clientId));
}

//get services for a client and return a row of service ids.

export async function getServiceIdsByClientId(
  clientId: number
): Promise<number[]> {
  const result = await database
    .select({ serviceId: clientsToServices.serviceId })
    .from(clientsToServices)
    .where(eq(clientsToServices.clientId, clientId));

  return result.map(row => row.serviceId);
}

export async function updateClientServices(
  userId: UserId,
  clientId: ClientId,
  serviceIds: number[]
) {
  await database
    .delete(clientsToServices)
    .where(eq(clientsToServices.clientId, clientId));

  if (serviceIds.length > 0) {
    await database
      .insert(clientsToServices)
      .values(serviceIds.map(serviceId => ({ clientId, serviceId })));
  }
}

export async function getServicesByClientId(clientId: number) {
  const result = await database
    .select({
      id: services.id,
      name: services.name
    })
    .from(clientsToServices)
    .innerJoin(services, eq(clientsToServices.serviceId, services.id))
    .where(eq(clientsToServices.clientId, clientId));

  return result;
}

export async function getClientsByServiceId(serviceId: ServicesId) {
  const result = await database
    .select({
      id: clients.id,
      business_name: clients.business_name
    })
    .from(clientsToServices)
    .innerJoin(clients, eq(clientsToServices.clientId, clients.id))
    .where(eq(clientsToServices.serviceId, serviceId));
  return result;
}
