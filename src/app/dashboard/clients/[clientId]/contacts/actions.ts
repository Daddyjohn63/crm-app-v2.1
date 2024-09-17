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
import { createContactUseCase } from '@/use-cases/contacts';
import { contactSchema } from '@/app/dashboard/validation';

const extendedContactSchema = contactSchema.extend({
  clientId: z.number()
});

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
  .input(z.object({ rowId: z.number() }))
  .handler(async ({ input, ctx }) => {
    // Placeholder action, does nothing
    console.log(`Received request to delete row(s) with ID: ${input.rowId}`);
    return { success: true };
  });
