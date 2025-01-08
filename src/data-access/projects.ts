import { boards, boardPermissions } from '@/db/schema/projects';
import type { Board, NewBoard } from '@/db/schema/projects';
import { eq, and } from 'drizzle-orm';
import { BoardPermission } from '@/db/schema/enums';
import { database } from '@/db/drizzle';
import { clients } from '@/db/schema/base';

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

// Function to get all clients and their project boards for a specific user
// Returns an array of clients, each containing their basic info and an array of their boards
export async function getClientBoardsByUserId(
  userId: number,
  trx = database
): Promise<
  Array<{
    clientId: number;
    clientName: string;
    boards: Array<{
      id: number;
      name: string;
      description: string | null;
    }>;
  }>
> {
  // Query the database to get all clients and their boards (if any)
  // Using LEFT JOIN to ensure we get ALL clients, even those without boards
  const result = await trx
    .select({
      clientId: clients.id,
      clientName: clients.business_name,
      boardId: boards.id, // Will be null for clients without boards
      boardName: boards.name,
      boardDescription: boards.description
    })
    .from(clients)
    .leftJoin(boards, eq(boards.clientId, clients.id)) // LEFT JOIN keeps all clients, matches boards where available
    .where(eq(clients.userId, userId));

  // Transform the flat query results into a nested structure
  // We need to group boards under their respective clients
  const clientBoards = result.reduce(
    (acc, row) => {
      // Check if we've already added this client to our accumulator
      const existingClient = acc.find(
        (c: { clientId: number }) => c.clientId === row.clientId
      );

      if (existingClient) {
        // If client exists and this row has a board, add it to the client's boards
        if (row.boardId && row.boardName) {
          existingClient.boards.push({
            id: row.boardId,
            name: row.boardName,
            description: row.boardDescription
          });
        }
      } else {
        // If client doesn't exist in our accumulator, add them
        // If this row has a board, include it, otherwise use empty array
        acc.push({
          clientId: row.clientId,
          clientName: row.clientName,
          boards:
            row.boardId && row.boardName
              ? [
                  {
                    id: row.boardId,
                    name: row.boardName,
                    description: row.boardDescription
                  }
                ]
              : [] // Empty array for clients with no boards
        });
      }

      return acc;
    },
    [] as Array<{
      clientId: number;
      clientName: string;
      boards: Array<{
        id: number;
        name: string;
        description: string | null;
      }>;
    }>
  );

  return clientBoards;
}
