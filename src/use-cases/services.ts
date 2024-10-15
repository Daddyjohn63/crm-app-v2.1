import { NewServiceInput } from '@/db/schema';
import { UserSession } from './types';
import { createService } from '@/data-access/services';

export async function createServiceUseCase(
  authenticatedUser: UserSession,
  newService: Omit<NewServiceInput, 'userId'>
) {
  await createService({
    ...newService,
    userId: authenticatedUser.id
  });
}
