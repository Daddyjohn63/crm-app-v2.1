import { NewServiceInput } from '@/db/schema';
import { UserSession } from './types';
import { createService, getServicesByUser } from '@/data-access/services';

export async function createServiceUseCase(
  authenticatedUser: UserSession,
  newService: Omit<NewServiceInput, 'userId'>
) {
  await createService({
    ...newService,
    userId: authenticatedUser.id
  });
}

export async function getServicesUseCase(authenticatedUser: UserSession) {
  const services = await getServicesByUser(authenticatedUser.id);
  return services;
}
