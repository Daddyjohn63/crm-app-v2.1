import { boards, boardPermissions, lists, cards } from '@/db/schema/projects';
import type {
  Board,
  Card,
  List,
  NewBoard,
  NewList
} from '@/db/schema/projects';
import { eq, and, asc, sql } from 'drizzle-orm';
import { BoardPermission } from '@/db/schema/enums';
import { database } from '@/db/drizzle';
import { clients, User } from '@/db/schema/base';
import {
  CardUpdate,
  CardWithProfile,
  ListWithCards,
  UserWithProfile
} from '@/use-cases/types';
import { users } from '@/db/schema/base';
import { profiles } from '@/db/schema/base';

// Raw database types
export type CreateBoardInput = Omit<NewBoard, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateBoardPermissionInput = {
  boardId: number;
  userId: number;
  permissionLevel: BoardPermission;
};

export type UpdateBoardInput = {
  name?: string;
  description?: string;
};

// Database operations
export async function insertBoard(
  input: CreateBoardInput,
  trx = database
): Promise<Board> {
  const [board] = await trx.insert(boards).values(input).returning();
  return board;
}

export async function updateBoard(
  boardId: number,
  input: UpdateBoardInput,
  user: User,
  trx = database
): Promise<Board> {
  const [board] = await trx
    .update(boards)
    .set(input)
    .where(eq(boards.id, boardId))
    .returning();
  return board;
}

export async function deleteBoard(
  boardId: number,
  user: User,
  trx = database
): Promise<void> {
  await trx.delete(boards).where(eq(boards.id, boardId));
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
): Promise<Board | null> {
  const result = await trx
    .select()
    .from(boards)
    .where(eq(boards.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getListsByBoardId(boardId: number) {
  return await database.query.lists.findMany({
    where: (list, { eq }) => eq(list.boardId, boardId),
    orderBy: [asc(lists.order)],
    with: {
      cards: {
        orderBy: [asc(cards.order)],
        with: {
          assignedUserProfile: {
            columns: {
              displayName: true
            }
          }
        }
      }
    }
  });
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

//get all boards for a client
export async function getBoardsByClientId(clientId: number) {
  return await database.query.boards.findMany({
    where: (board, { eq }) => eq(board.clientId, clientId)
  });
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

export async function getBoardPermission(
  userId: number,
  boardId: number
): Promise<BoardPermission | null> {
  const permission = await database.query.boardPermissions.findFirst({
    where: (boardPermission, { eq, and }) =>
      and(
        eq(boardPermission.userId, userId),
        eq(boardPermission.boardId, boardId)
      )
  });
  return permission?.permissionLevel ?? null;
}

export async function createList(
  name: string,
  boardId: number,
  user: User
): Promise<List> {
  // Get the maximum order value for the current board
  const [maxOrderResult] = await database
    .select({
      maxOrder: sql`COALESCE(MAX(${lists.order}), -1)`.mapWith(Number)
    })
    .from(lists)
    .where(eq(lists.boardId, boardId));

  const newList: NewList = {
    name,
    boardId,
    order: (maxOrderResult?.maxOrder ?? -1) + 1
  };

  const [list] = await database.insert(lists).values(newList).returning();
  return list;
}

export async function updateList(
  listId: number,
  name: string,
  trx = database
): Promise<List> {
  const [updatedList] = await trx
    .update(lists)
    .set({ name })
    .where(eq(lists.id, listId))
    .returning();

  return updatedList;
}

export async function getListById(
  listId: number,
  trx = database
): Promise<List | undefined> {
  const [list] = await trx
    .select()
    .from(lists)
    .where(eq(lists.id, listId))
    .limit(1);

  return list;
}

export async function deleteList(
  listId: number,
  trx = database
): Promise<void> {
  await trx.delete(lists).where(eq(lists.id, listId));
}

export async function getCardsByListId(
  listId: number,
  trx = database
): Promise<Card[]> {
  return await trx
    .select()
    .from(cards)
    .where(eq(cards.listId, listId))
    .orderBy(asc(cards.order));
}

export async function createCard(
  data: {
    name: string;
    description: string | null;
    listId: number;
    order: number;
    status: 'todo' | 'in_progress' | 'done' | 'blocked';
    assignedTo?: number;
    dueDate?: Date;
  },

  trx = database
): Promise<Card> {
  const [card] = await trx
    .insert(cards)
    .values({
      ...data,
      dueDate: data.dueDate || undefined,
      assignedTo: data.assignedTo || undefined
    })
    .returning();
  return card;
}

export async function updateListOrder(
  items: { id: number; order: number }[],
  trx = database
): Promise<void> {
  await Promise.all(
    items.map(item =>
      trx.update(lists).set({ order: item.order }).where(eq(lists.id, item.id))
    )
  );
}

export async function updateCardOrder(
  cardUpdates: { id: number; order: number; listId: number }[],
  trx = database
): Promise<void> {
  await Promise.all(
    cardUpdates.map(card =>
      trx
        .update(cards)
        .set({ order: card.order, listId: card.listId })
        .where(eq(cards.id, card.id))
    )
  );
}

export async function getBoardUsers(
  boardId: number
): Promise<UserWithProfile[]> {
  const result = await database
    .select({
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      role: users.role,
      displayName: profiles.displayName
    })
    .from(boardPermissions)
    .innerJoin(users, eq(users.id, boardPermissions.userId))
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(boardPermissions.boardId, boardId));

  return result;
}

export async function deleteCard(cardId: number, user: User): Promise<void> {
  await database.delete(cards).where(eq(cards.id, cardId));
}

export async function updateCard(data: CardUpdate) {
  return await database
    .update(cards)
    .set({
      name: data.name,
      description: data.description,
      status: data.status,
      assignedTo: data.assignedTo,
      dueDate: data.dueDate,
      listId: data.listId,
      updatedAt: new Date()
    })
    .where(eq(cards.id, data.cardId));
}

// In src/data-access/projects.ts
export async function getCardById(cardId: number): Promise<Card | null> {
  const [result] = await database
    .select()
    .from(cards)
    .where(eq(cards.id, cardId))
    .limit(1);

  return result || null;
}
