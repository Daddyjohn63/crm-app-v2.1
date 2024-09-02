'use server';

import { rateLimitByKey } from '@/lib/limiter';
import { authenticatedAction } from '@/lib/safe-action';
import { createClientUseCase } from '@/use-cases/clients';
import { revalidatePath } from 'next/cache';

import { NewClient, NewClientInput } from '@/db/schema';
import { schema } from './validation';

export const createClientAction = authenticatedAction
  .createServerAction()
  .input(schema)
  .handler(
    async ({
      input: {
        business_name,
        primary_address,
        primary_email,
        primary_phone,
        business_description,
        date_onboarded,
        additional_info
      },
      ctx: { user }
    }) => {
      await rateLimitByKey({
        key: `${user.id}-create-client`
      });

      await createClientUseCase(user, {
        business_name,
        primary_address,
        primary_email,
        primary_phone,
        business_description,
        date_onboarded,
        additional_info
      } as NewClientInput);
      revalidatePath('/dashboard');
    }
  );
