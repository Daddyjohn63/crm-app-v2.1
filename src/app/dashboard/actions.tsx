'use server';

import { rateLimitByKey } from '@/lib/limiter';
import { authenticatedAction } from '@/lib/safe-action';
import {
  createClientUseCase,
  deleteClientUseCase,
  editClientUseCase,
  getClientByIdUseCase
} from '@/use-cases/clients';
import { revalidatePath } from 'next/cache';

import { NewClient, NewClientInput } from '@/db/schema';
import { schema } from './validation';
import { z } from 'zod';
import { redirect } from 'next/navigation';

//create client
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

//edit client
export const editClientAction = authenticatedAction
  .createServerAction()
  .input(schema.extend({ client_id: z.string() }))
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByKey({
      key: `${user.id}-edit-client`
    });

    const { client_id, ...updatedFields } = input;

    const existingClient = await editClientUseCase(
      user,
      parseInt(client_id, 10),
      updatedFields as Partial<Omit<NewClient, 'userId'>>
    );

    revalidatePath(`/dashboard/clients/${client_id}/info`);
    return existingClient;
  });

// Add this new action
export const getClientAction = authenticatedAction
  .createServerAction()
  .input(z.object({ client_id: z.string() }))
  .handler(async ({ input, ctx: { user } }) => {
    const client = await getClientByIdUseCase(
      user,
      parseInt(input.client_id, 10)
    );
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  });

export const deleteClientAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      clientId: z.number()
    })
  )
  .handler(async ({ input, ctx }) => {
    const clientId = input.clientId;
    await deleteClientUseCase(ctx.user, {
      clientId
    });
    redirect('/dashboard');
  });
