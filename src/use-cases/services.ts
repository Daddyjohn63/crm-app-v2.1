import { NewServiceInput } from '@/db/schema';
import { UserSession } from './types';
import {
  createService,
  getServiceById,
  getServicesByUser
} from '@/data-access/services';
import { NotFoundError } from '@/app/util';

export async function createServiceUseCase(
  authenticatedUser: UserSession,
  newService: Omit<NewServiceInput, 'userId'>
) {
  await createService({
    ...newService,
    userId: authenticatedUser.id
  });
}
//get all services for a user
export async function getServicesUseCase(authenticatedUser: UserSession) {
  const services = await getServicesByUser(authenticatedUser.id);
  return services;
}

//get a service by id
export async function getServiceByIdUseCase(
  authenticatedUser: UserSession,
  serviceId: number
) {
  const service = await getServiceById(authenticatedUser.id, serviceId);

  if (!service) {
    throw new NotFoundError('Service not found!');
  }

  return service;
}
