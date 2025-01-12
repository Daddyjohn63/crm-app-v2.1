'use server';
import { boards } from '@/db/schema';
import { authenticatedAction } from '@/lib/safe-action';
import { rateLimitByKey } from '@/lib/limiter';
import { revalidatePath } from 'next/cache';
//import { createProjectUseCase } from '@/use-cases/projects';
import { sanitizeUserInput } from '@/util/sanitize';
import { z } from 'zod';
import { createBoard, createList, getProjectById } from '@/use-cases/projects';
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

// export const getProjectsAction = authenticatedAction
//   .createServerAction()
//   .handler(async ({ ctx: { user } }) => {
//     return console.log('getProjectsAction');
//   });

// export const getProjectAction = authenticatedAction
//   .createServerAction()
//   .handler(async ({ ctx: { user } }) => {
//     return console.log('getProjectAction');
//   });

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
    return await createList(name, boardId, user);
  });

// Server action
// async function createProjectBoard(input: CreateBoardInput) {
//   const user = await getCurrentUser();
//   return await createBoard(input, user);  // calls use-case
// }

// // Use-case handles:
// - Checking if user is admin
// - Creating board
// - Setting up owner permission
// - Managing transaction

// // Data-access handles:
// - Raw database operations
// - No business logic
