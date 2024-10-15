'use server';
import { authenticatedAction } from '@/lib/safe-action';
import { z } from 'zod';
import { serviceSchema } from '@/app/dashboard/validation';
import { rateLimitByKey } from '@/lib/limiter';
import { revalidatePath } from 'next/cache';
import { createServiceUseCase } from '@/use-cases/services';

const extendedServiceSchema = serviceSchema.extend({
  serviceId: z.number() //this is optional as we are creating a new service
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
