'use server';

import { rateLimitByKey } from '@/lib/limiter';
import { authenticatedAction } from '@/lib/safe-action';
import { sanitizeUserInput } from '@/util/sanitize';
import { z } from 'zod';

export const addGuestUserAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      permissionLevel: z.enum(['editor', 'viewer']),
      boardName: z.string().min(1)
    })
  )
  .handler(
    async ({
      input: { name, email, permissionLevel, boardName },
      ctx: { user }
    }) => {
      await rateLimitByKey({
        key: `${user.id}-add-guest-user`
      });

      const sanitizedInput = {
        name: sanitizeUserInput(name),
        email: sanitizeUserInput(email),
        permissionLevel,
        boardName
      };

      await console.log('[addGuestUserAction] Triggered with:', {
        name,
        email,
        permissionLevel,
        boardName,
        userId: user.id
      });
      return { success: true };
    }
  );

export const editGuestUserAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      guestId: z.number(),
      name: z.string().min(1),
      email: z.string().email(),
      permissionLevel: z.enum(['editor', 'viewer']),
      boardName: z.string().min(1)
    })
  )
  .handler(
    async ({
      input: { guestId, name, email, permissionLevel, boardName },
      ctx: { user }
    }) => {
      await rateLimitByKey({
        key: `${user.id}-edit-guest-user`
      });

      const sanitizedInput = {
        name: sanitizeUserInput(name),
        email: sanitizeUserInput(email),
        permissionLevel,
        boardName
      };

      await console.log('[editGuestUserAction] Triggered with:', {
        guestId,
        name,
        email,
        permissionLevel,
        boardName,
        userId: user.id
      });
      return { success: true };
    }
  );
