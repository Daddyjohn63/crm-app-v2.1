'use server';

import { rateLimitByKey } from '@/lib/limiter';
import { authenticatedAction } from '@/lib/safe-action';
import {
  createClientUseCase,
  deleteClientUseCase,
  editClientUseCase,
  getClientByIdUseCase,
  updateClientServicesUseCase
} from '@/use-cases/clients';
import { revalidatePath } from 'next/cache';

import { NewClient, NewClientInput } from '@/db1/schema';
import { schema } from './validation';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { PublicError } from '@/use-cases/errors';
import { getServiceIdsByClientId } from '@/data-access/clients';
import { SALES_STAGE_FILTER_OPTIONS } from '@/use-cases/types';
import { sanitizeUserInput } from '@/util/sanitize';

//create client
// export const createClientAction = authenticatedAction
//   .createServerAction()
//   .input(schema)
//   .handler(
//     async ({
//       input: {
//         business_name,
//         primary_address,
//         primary_email,
//         primary_phone,
//         business_description,
//         date_onboarded,
//         additional_info
//       },
//       ctx: { user }
//     }) => {
//       await rateLimitByKey({
//         key: `${user.id}-create-client`
//       });

//       await createClientUseCase(user, {
//         business_name,
//         primary_address,
//         primary_email,
//         primary_phone,
//         business_description,
//         date_onboarded,
//         additional_info
//       } as NewClientInput);
//       revalidatePath('/dashboard');
//     }
//   );

//create client sanitized
//import { sanitizeUserInput } from '@/lib/sanitize';

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

      const sanitizedInput = {
        business_name: sanitizeUserInput(business_name ?? ''),
        primary_address: sanitizeUserInput(primary_address ?? ''),
        primary_email: sanitizeUserInput(primary_email ?? ''),
        primary_phone: sanitizeUserInput(primary_phone ?? ''),
        business_description: sanitizeUserInput(business_description ?? ''),
        date_onboarded,
        additional_info: sanitizeUserInput(additional_info ?? '')
      };

      await createClientUseCase(user, sanitizedInput as NewClientInput);
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

    const sanitizedInput = {
      ...updatedFields,
      business_name: sanitizeUserInput(updatedFields.business_name ?? ''),
      primary_address: sanitizeUserInput(updatedFields.primary_address ?? ''),
      primary_email: sanitizeUserInput(updatedFields.primary_email ?? ''),
      primary_phone: sanitizeUserInput(updatedFields.primary_phone ?? ''),
      business_description: sanitizeUserInput(
        updatedFields.business_description ?? ''
      ),
      additional_info: sanitizeUserInput(updatedFields.additional_info ?? '')
    };

    const existingClient = await editClientUseCase(
      user,
      parseInt(client_id, 10),
      sanitizedInput as Partial<Omit<NewClient, 'userId'>>
    );

    // const existingClient = await editClientUseCase(
    //   user,
    //   parseInt(client_id, 10),
    //   updatedFields as Partial<Omit<NewClient, 'userId'>>
    // );

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
      throw new PublicError('Client not found!');
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

//get services for a client

export const getServiceIdsByClientIdAction = authenticatedAction
  .createServerAction()
  .input(z.object({ clientId: z.number() }))
  .handler(async ({ input }) => {
    return await getServiceIdsByClientId(input.clientId);
  });

export const updateClientServicesAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      clientId: z.number(),
      serviceIds: z.array(z.number())
    })
  )
  .handler(async ({ input, ctx: { user } }) => {
    await rateLimitByKey({
      key: `${user.id}-update-client-services`
    });

    const { clientId, serviceIds } = input;

    try {
      await updateClientServicesUseCase(user, {
        clientId,
        serviceIds
      });

      revalidatePath(`/dashboard/clients/${clientId}/info`);
    } catch (error) {
      console.error('Error updating client services:', error);
      throw new Error('Failed to update client services');
    }
  });

//handle search
export async function handleSearch(formData: FormData) {
  const searchString = formData.get('search') as string;
  const stageValue = formData.get('stage') as string;
  const params = new URLSearchParams();

  if (searchString) params.set('search', searchString);
  if (stageValue && stageValue !== SALES_STAGE_FILTER_OPTIONS.ALL) {
    params.set('stage', stageValue);
  }

  redirect(
    params.toString() ? `/dashboard?${params.toString()}` : '/dashboard'
  );
}
