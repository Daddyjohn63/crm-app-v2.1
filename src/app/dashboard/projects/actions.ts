'use server';
import { boards } from '@/db/schema';
import { authenticatedAction } from '@/lib/safe-action';
import { rateLimitByKey } from '@/lib/limiter';
import { revalidatePath } from 'next/cache';
//import { createProjectUseCase } from '@/use-cases/projects';
import { sanitizeUserInput } from '@/util/sanitize';
import { z } from 'zod';
import {
  createBoard,
  createList,
  getProjectById,
  updateList,
  deleteList,
  copyList,
  createCard
} from '@/use-cases/projects';
import { getClientsByUser } from '@/data-access/clients';

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  clientId: z.number()
});

export const createProjectAction = authenticatedAction
  .createServerAction()
  .input(projectSchema)
  .handler(
    async ({ input: { name, description, clientId }, ctx: { user } }) => {
      await rateLimitByKey({
        key: `${user.id}-create-project`
      });

      const sanitizedInput = {
        name: sanitizeUserInput(name),
        description: sanitizeUserInput(description),
        clientId
      };

      await createBoard(sanitizedInput, user);
      revalidatePath('/dashboard/projects');
    }
  );

export const getClientsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { user } }) => {
    return await getClientsByUser(user.id);
  });

export const getProjectByIdAction = authenticatedAction
  .createServerAction()
  .input(z.string())
  .handler(async ({ input: projectId }) => {
    try {
      const project = await getProjectById(parseInt(projectId));
      return [project, null] as const;
    } catch (error) {
      return [null, error] as const;
    }
  });

export const createListAction = authenticatedAction
  .createServerAction()
  .input(z.object({ name: z.string().min(1), boardId: z.number() }))
  .handler(async ({ input: { name, boardId }, ctx: { user } }) => {
    revalidatePath(`/dashboard/projects/${boardId}`);
    return await createList(name, boardId, user);
  });

export const updateListAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      listId: z.number(),
      name: z.string().min(1),
      boardId: z.number()
    })
  )
  .handler(async ({ input: { listId, name, boardId }, ctx: { user } }) => {
    revalidatePath(`/dashboard/projects/${boardId}`);
    return await updateList(listId, name, user);
  });

export const deleteListAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      listId: z.number(),
      boardId: z.number()
    })
  )
  .handler(async ({ input: { listId, boardId }, ctx: { user } }) => {
    revalidatePath(`/dashboard/projects/${boardId}`);
    return await deleteList(listId, user);
  });

export const copyListAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      listId: z.number(),
      boardId: z.number()
    })
  )
  .handler(async ({ input: { listId, boardId }, ctx: { user } }) => {
    revalidatePath(`/dashboard/projects/${boardId}`);
    return await copyList(listId, user);
  });

export const createCardAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      listId: z.number(),
      boardId: z.number()
    })
  )
  .handler(
    async ({
      input: { name, description, listId, boardId },
      ctx: { user }
    }) => {
      try {
        process.stdout.write(
          `\n[DEBUG] Server Action: createCardAction started ${JSON.stringify(
            {
              name,
              description,
              listId,
              boardId,
              userId: user.id
            },
            null,
            2
          )}\n`
        );

        const card = await createCard(
          {
            name: sanitizeUserInput(name),
            description: description
              ? sanitizeUserInput(description)
              : undefined,
            listId
          },
          user
        );

        process.stdout.write(
          `\n[DEBUG] Server Action: Card created successfully ${JSON.stringify(
            card,
            null,
            2
          )}\n`
        );

        revalidatePath(`/dashboard/projects/${boardId}`);
        return { success: true, card };
      } catch (error) {
        process.stdout.write(
          `\n[ERROR] Server Action: createCardAction error: ${
            error instanceof Error ? error.message : String(error)
          }\n`
        );
        throw error;
      }
    }
  );
