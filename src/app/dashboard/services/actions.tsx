'use server';
import { authenticatedAction } from '@/lib/safe-action';
import { z } from 'zod';
import { serviceSchema } from '@/app/dashboard/validation';
import { rateLimitByKey } from '@/lib/limiter';
import { revalidatePath } from 'next/cache';
import {
  createServiceUseCase,
  deleteServiceUseCase,
  editServiceUseCase,
  getServiceByIdUseCase
} from '@/use-cases/services';
import { redirect } from 'next/navigation';

const extendedServiceSchema = serviceSchema.extend({
  serviceId: z.number() //this is optional as we are creating a new service
});

// export const getServiceAction = authenticatedAction
//   .createServerAction()
//   .input(z.object({ serviceId: z.number() }))
//   .handler(async ({ input: { serviceId }, ctx: { user } }) => {
//     const service = await getServiceByIdUseCase(serviceId);
//     if (!service) {
//       throw new Error('Service not found');
//     }
//     return service;
//   });

export const deleteServiceAction = authenticatedAction
  .createServerAction()
  .input(z.object({ serviceId: z.number() }))
  .handler(async ({ input: { serviceId }, ctx: { user } }) => {
    await rateLimitByKey({
      key: `${user.id}-delete-service`
    });
    await deleteServiceUseCase(user, serviceId);
    revalidatePath(`/dashboard/services`);
    redirect('/dashboard/services');
  });

export const createServiceAction = authenticatedAction
  .createServerAction()
  .input(extendedServiceSchema)
  .handler(
    async ({
      input: {
        name,
        description,
        included_services,
        delivery_process,
        pricing
      },
      ctx: { user }
    }) => {
      await rateLimitByKey({
        key: `${user.id}-create-service`
      });
      await createServiceUseCase(user, {
        name,
        description,
        included_services,
        delivery_process,
        pricing
      });
      revalidatePath(`/dashboard/services`);
    }
  );

export const getServiceAction = authenticatedAction
  .createServerAction()
  .input(z.object({ serviceId: z.number() }))
  .handler(async ({ input: { serviceId }, ctx: { user } }) => {
    const service = await getServiceByIdUseCase(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  });

// ... existing code ...

export const editServiceAction = authenticatedAction
  .createServerAction()
  .input(serviceSchema.extend({ serviceId: z.number() }))
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByKey({
      key: `${user.id}-edit-service`
    });
    const { serviceId, ...serviceData } = input;
    await editServiceUseCase(user, serviceId, serviceData);
    revalidatePath('/dashboard/services');
  });

// ... existing code ...
