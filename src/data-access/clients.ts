import { database } from '@/db/drizzle';
import { Client, ClientId, NewClient, clients } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { UserId } from '@/use-cases/types';

export async function createClient(newClient: NewClient) {
  const [client] = await database.insert(clients).values(newClient).returning();
  return client;
}

export async function getClientsByUser(userId: UserId) {
  const userClients = await database.query.clients.findMany({
    where: eq(clients.userId, userId)
  });
  return userClients;
}
