import { database } from '@/db/drizzle';
import { Client, ClientId, NewClient, clients } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

// export async function createClient(newClient: {
//   clientId: ClientId;
//   business_name: string;
//   primary_address: string;
//   primary_email: string;
//   primary_phone: string;
//   business_description: string;
//   date_onboarded: Date;
//   additional_info: string;
// }) {
//   const [client] = await database.insert(clients).values(newClient).returning();
//   return client;
// }

export async function createClient(client: NewClient) {
  await database.insert(clients).values(client);
}
