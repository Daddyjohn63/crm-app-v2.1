'use server';
import { authenticatedAction } from '@/lib/safe-action';
import { z } from 'zod';
import { serviceSchema } from '@/app/dashboard/validation';
import { rateLimitByKey } from '@/lib/limiter';
import { revalidatePath } from 'next/cache';
import {
  createServiceUseCase,
  deleteServiceUseCase
} from '@/use-cases/services';
import { redirect } from 'next/navigation';

const extendedServiceSchema = serviceSchema.extend({
  serviceId: z.number() //this is optional as we are creating a new service
});

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
