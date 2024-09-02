//business logic
//make sure there is a session
//call create event
//handle errors
//when it comes to editing , I need to make sure that the user is entitled to edit that client
import { ClientId, NewClientInput } from '@/db/schema';
import { UserId } from '@/use-cases/types';
import { UserSession } from './types';
import { createClient } from '@/data-access/clients';
import { createUUID } from '@/util/uuid';

//authenticatedUser will be passed when we create the server action and zsa.

export async function createClientUseCase(
  authenticatedUser: UserSession,
  newClient: NewClientInput
) {
  await createClient({ ...newClient, userId: authenticatedUser.id });
}
