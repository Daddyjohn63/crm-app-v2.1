import { database } from '@/db/drizzle';
import { NewServices, services, ServicesId } from '@/db/schema';
import { UserId } from '@/use-cases/types';
import { and, eq } from 'drizzle-orm';

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

// export async function getServiceById(userId: UserId, serviceId: ServicesId) {
//   const service = await database.query.services.findFirst({
//     where: and(eq(services.userId, userId), eq(services.id, serviceId))
//   });
//   return service;
// }

export async function getServiceById(serviceId: ServicesId) {
  const service = await database.query.services.findFirst({
    where: eq(services.id, serviceId)
  });
  return service;
}

export async function deleteService(userId: UserId, serviceId: ServicesId) {
  await database
    .delete(services)
    .where(and(eq(services.userId, userId), eq(services.id, serviceId)));
}
