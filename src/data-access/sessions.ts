import { database } from '@/db/drizzle';
import { sessions } from '@/db1/schema';
import { UserId } from '@/use-cases/types';
import { eq } from 'drizzle-orm';

export async function deleteSessionForUser(userId: UserId, trx = database) {
  await trx.delete(sessions).where(eq(sessions.userId, userId));
}
