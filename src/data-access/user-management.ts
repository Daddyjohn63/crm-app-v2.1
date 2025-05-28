import { database } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { users, profiles } from '@/db/schema/base';

export async function getGuestUsers() {
  // Join users and profiles, filter for role 'guest'
  return await database
    .select({
      id: users.id,
      email: users.email,
      displayName: profiles.displayName
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(users.role, 'guest'));
}
