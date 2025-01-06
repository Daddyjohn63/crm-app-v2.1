'use server';

import { getClientsByUser } from '@/data-access/clients';
import { authenticatedAction } from '@/lib/safe-action';

export const getClientsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    return await getClientsByUser(user.id);
  });
