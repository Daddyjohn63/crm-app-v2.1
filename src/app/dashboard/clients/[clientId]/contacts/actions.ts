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

import { NewClient, NewClientInput, NewContactInput } from '@/db/schema';
//import { schema } from './validation';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import {
  createContactUseCase,
  deleteContactsUseCase,
  editContactUseCase,
  getContactByIdUseCase
} from '@/use-cases/contacts';
import { contactSchema } from '@/app/dashboard/validation';

const extendedContactSchema = contactSchema.extend({
  clientId: z.number(),
  contactId: z.number()
});

export const getContactAction = authenticatedAction
  .createServerAction()
  .input(z.object({ contactId: z.number() }))
  .handler(async ({ input: { contactId }, ctx: { user } }) => {
    const contact = await getContactByIdUseCase(user, contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  });

export const editContactAction = authenticatedAction
  .createServerAction()
  .input(extendedContactSchema)
  .handler(
    async ({
      input: {
        contactId,
        last_name,
        first_name,
        job_title,
        email,
        phone,
        address,
        city,
        county,
        postcode,
        country,
        clientId
      },
      ctx: { user }
    }) => {
      await rateLimitByKey({
        key: `${user.id}-edit-contact`
      });
      await editContactUseCase(user, contactId, {
        last_name,
        first_name,
        job_title,
        email,
        phone,
        address,
        city,
        county,
        postcode,
        country,
        clientId
      } as NewContactInput);
      revalidatePath(`/dashboard/clients/${clientId}/contacts`);
    }
  );

export const createContactAction = authenticatedAction
  .createServerAction()
  .input(extendedContactSchema)
  .handler(
    async ({
      input: {
        last_name,
        first_name,
        job_title,
        email,
        phone,
        address,
        city,
        county,
        postcode,
        country,
        clientId
      },
      ctx: { user }
    }) => {
      await rateLimitByKey({
        key: `${user.id}-create-contact`
      });
      await createContactUseCase(user, {
        last_name,
        first_name,
        job_title,
        email,
        phone,
        address,
        city,
        county,
        postcode,
        country,
        clientId
      } as NewContactInput);
      revalidatePath(`/dashboard/clients/${clientId}/contacts`);
    }
  );

export const deleteContactRowAction = authenticatedAction
  .createServerAction()
  .input(z.object({ clientId: z.number(), rowIds: z.array(z.number()) }))
  .handler(async ({ input: { clientId, rowIds }, ctx: { user } }) => {
    // Delete multiple rows
    console.log(`Deleting rows with IDs: ${rowIds.join(', ')}`);
    await deleteContactsUseCase(user, clientId, rowIds);
    revalidatePath(`/dashboard/clients/${clientId}/contacts`);
    return { success: true };
  });
