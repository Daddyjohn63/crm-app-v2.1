'user server';

import { rateLimitByKey } from '@/lib/limiter';
import { authenticatedAction } from '@/lib/safe-action';
import { createClientUseCase } from '@/use-cases/clients';
import { schema } from './validation';
import { revalidatePath } from 'next/cache';
import { ClientInfo } from '@/use-cases/types';

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
      } as ClientInfo);
      revalidatePath('/dashboard');
    }
  );
