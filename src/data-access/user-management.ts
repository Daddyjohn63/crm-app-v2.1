import { database } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { users, profiles } from '@/db/schema/base';
import { boardPermissions, boards } from '@/db/schema/projects';

export async function getGuestUsers() {
  // Join users, profiles, boardPermissions, and boards, filter for role 'guest'
  return await database
    .select({
      id: users.id,
      email: users.email,
      displayName: profiles.displayName,
      boardId: boardPermissions.boardId,
      boardName: boards.name,
      permissionLevel: boardPermissions.permissionLevel
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .innerJoin(boardPermissions, eq(boardPermissions.userId, users.id))
    .innerJoin(boards, eq(boards.id, boardPermissions.boardId))
    .where(eq(users.role, 'guest'));
}

export async function getAllBoards() {
  return await database
    .select({ id: boards.id, name: boards.name })
    .from(boards);
}
