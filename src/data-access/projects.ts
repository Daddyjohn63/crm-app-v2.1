import { boards, boardPermissions } from '@/db/schema/projects';
import type { Board, NewBoard } from '@/db/schema/projects';
import { eq, and } from 'drizzle-orm';
import { BoardPermission } from '@/db/schema/enums';
import { database } from '@/db/drizzle';

// Raw database types
export type CreateBoardInput = Omit<NewBoard, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateBoardPermissionInput = {
  boardId: number;
  userId: number;
  permissionLevel: BoardPermission;
};

// Database operations
export async function insertBoard(
  input: CreateBoardInput,
  trx = database
): Promise<Board> {
  const [board] = await trx.insert(boards).values(input).returning();
  return board;
}

export async function insertBoardPermission(
  input: CreateBoardPermissionInput,
  trx = database
): Promise<void> {
  await trx.insert(boardPermissions).values(input);
}

export async function getBoardById(
  id: number,
  trx = database
): Promise<Board | undefined> {
  const result = await trx
    .select()
    .from(boards)
    .where(eq(boards.id, id))
    .limit(1);
  return result[0];
}

export async function getBoardsByUserId(
  userId: number,
  trx = database
): Promise<Board[]> {
  const userBoards = await trx
    .select({
      board: boards,
      permission: boardPermissions.permissionLevel
    })
    .from(boards)
    .innerJoin(
      boardPermissions,
      and(
        eq(boardPermissions.boardId, boards.id),
        eq(boardPermissions.userId, userId)
      )
    );
  return userBoards.map(({ board }) => board);
}

export async function findBoardPermission(
  boardId: number,
  userId: number,
  trx = database
): Promise<{ permissionLevel: BoardPermission } | undefined> {
  const result = await trx
    .select()
    .from(boardPermissions)
    .where(
      and(
        eq(boardPermissions.boardId, boardId),
        eq(boardPermissions.userId, userId)
      )
    )
    .limit(1);
  return result[0];
}

export async function updateBoardPermission(
  boardId: number,
  userId: number,
  permissionLevel: BoardPermission,
  trx = database
): Promise<void> {
  await trx
    .update(boardPermissions)
    .set({ permissionLevel })
    .where(
      and(
        eq(boardPermissions.boardId, boardId),
        eq(boardPermissions.userId, userId)
      )
    );
}

export async function deleteBoardPermission(
  boardId: number,
  userId: number,
  trx = database
): Promise<void> {
  await trx
    .delete(boardPermissions)
    .where(
      and(
        eq(boardPermissions.boardId, boardId),
        eq(boardPermissions.userId, userId)
      )
    );
}
