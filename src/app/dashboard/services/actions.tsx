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
  getServiceByIdUseCase,
  getServicesUseCase
} from '@/use-cases/services';
import { redirect } from 'next/navigation';
import { sanitizeUserInput } from '@/util/sanitize';

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
      const sanitizedInput = {
        name: sanitizeUserInput(name ?? ''),
        description: sanitizeUserInput(description ?? ''),
        included_services: sanitizeUserInput(included_services ?? ''),
        delivery_process: sanitizeUserInput(delivery_process ?? ''),
        pricing: sanitizeUserInput(pricing ?? '')
      };
      await createServiceUseCase(user, sanitizedInput);
      // description,
      // included_services,
      // delivery_process,
      // pricing
      // });
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
    const sanitizedInput = {
      name: sanitizeUserInput(serviceData.name ?? ''),
      description: sanitizeUserInput(serviceData.description ?? ''),
      included_services: sanitizeUserInput(serviceData.included_services ?? ''),
      delivery_process: sanitizeUserInput(serviceData.delivery_process ?? ''),
      pricing: sanitizeUserInput(serviceData.pricing ?? '')
    };
    await editServiceUseCase(user, serviceId, sanitizedInput);
    revalidatePath('/dashboard/services');
  });

// ... existing code ...
//a function that gets all services, and returns an array of service ids and the service name.do the db use case and data access in this file. I will move them to their own files later.

export const getServicesAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    const services = await getServicesUseCase(user);
    return services;
  });
