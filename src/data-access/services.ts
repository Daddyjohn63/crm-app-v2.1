import { database } from '@/db/drizzle';
import { NewServices, services } from '@/db/schema';

export async function createService(newService: NewServices) {
  const [service] = await database
    .insert(services)
    .values(newService)
    .returning();
  return service;
}
