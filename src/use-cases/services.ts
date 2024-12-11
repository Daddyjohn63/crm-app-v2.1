import { NewServiceInput } from '@/db1/schema';
import { UserSession } from './types';
import {
  createService,
  deleteService,
  getServiceById,
  getServicesByUser,
  updateService
} from '@/data-access/services';
import { AuthenticationError, NotFoundError } from '@/app/util';

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

export async function deleteServiceUseCase(
  authenticatedUser: UserSession,
  serviceId: number
) {
  const existingService = await getServiceById(serviceId);
  if (!existingService) {
    throw new NotFoundError('Service not found');
  }
  if (existingService.userId !== authenticatedUser.id) {
    throw new NotFoundError('You are not authorized to delete this service');
  }
  await deleteService(authenticatedUser.id, serviceId);
}

//get a service by id
// export async function getServiceByIdUseCase(
//   authenticatedUser: UserSession,
//   serviceId: number
// ) {
//   const service = await getServiceById(authenticatedUser.id, serviceId);

//   if (!service) {
//     throw new NotFoundError('Service not found!');
//   }

//   return service;
// }

export async function getServiceByIdUseCase(serviceId: number) {
  const service = await getServiceById(serviceId);

  if (!service) {
    throw new NotFoundError('Service not found!!');
  }

  return service;
}

export async function editServiceUseCase(
  authenticatedUser: UserSession,
  serviceId: number,
  updatedService: Partial<Omit<NewServiceInput, 'userId'>>
) {
  const existingService = await getServiceById(serviceId);
  if (!existingService) {
    throw new NotFoundError('Service not found');
  }
  if (existingService.userId !== authenticatedUser.id) {
    throw new NotFoundError('You are not authorized to edit this service');
  }
  await updateService(serviceId, updatedService);
  return existingService;
}
