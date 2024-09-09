import { database } from '@/db/drizzle';
import { Client, ClientId, NewClient, clients } from '@/db/schema';
import { asc, eq, ilike, sql, and } from 'drizzle-orm';
import { UserId } from '@/use-cases/types';

export async function createClient(newClient: NewClient) {
  const [client] = await database.insert(clients).values(newClient).returning();
  return client;
}

export async function getClientsByUser(userId: UserId) {
  console.log('GET-CLIENTS-BY-USER-CHECK', userId); //yes, userId is correct
  const userClients = await database.query.clients.findMany({
    where: eq(clients.userId, userId)
  });
  //console.log('FOUND CLIENTS:', userClients.length);
  return userClients;
}

export async function searchClientsByName(
  userId: UserId,
  search: string,
  page: number
) {
  const CLIENTS_PER_PAGE = 3;

  const condition = search
    ? and(
        eq(clients.userId, userId),
        ilike(clients.business_name, `%${search}%`)
      )
    : eq(clients.userId, userId);

  const userClients = await database.query.clients.findMany({
    where: condition,
    limit: CLIENTS_PER_PAGE,
    offset: (page - 1) * CLIENTS_PER_PAGE
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
