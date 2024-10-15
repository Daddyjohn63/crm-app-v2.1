import { database } from '@/db/drizzle';
import { NewServices, services } from '@/db/schema';
import { UserId } from '@/use-cases/types';
import { eq } from 'drizzle-orm';

export async function createService(newService: NewServices) {
  const [service] = await database
    .insert(services)
    .values(newService)
    .returning();
  return service;
}

export async function getServicesByUser(userId: UserId) {
  const userServices = await database.query.services.findMany({
    where: eq(services.userId, userId)
  });
  return userServices;
}
