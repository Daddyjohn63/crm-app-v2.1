import { database } from '@/db/drizzle';
import type { Board, List, Card } from '@/db/schema/projects';
import type { User } from '@/db/schema/base';
import { BoardPermission, TaskStatus, taskStatusEnum } from '@/db/schema/enums';
import * as projectsDb from '@/data-access/projects';
import { ListWithCards } from '@/use-cases/types';

export type CreateBoardInput = {
  name: string;
  description?: string;
  clientId: number;
};
//pass in the values from the form and the user.
export async function createBoard(
  input: CreateBoardInput,
  user: User
): Promise<Board> {
  // Only admins can create boards
  if (user.role !== 'admin') {
    throw new Error('Only admins can create boards');
  }

  return await database.transaction(async trx => {
    // Spread the input and add the userId and create the board.
    const board = await projectsDb.insertBoard(
      {
        ...input,
        userId: user.id
      },
      trx
    );

    // Set creator as owner
    await projectsDb.insertBoardPermission(
      {
        boardId: board.id,
        userId: user.id,
        permissionLevel: 'owner'
      },
      trx
    );

    return board;
  });
}

export async function addUserToBoard(
  boardId: number,
  targetUserId: number,
  permissionLevel: BoardPermission,
  currentUser: User
): Promise<void> {
  // Check if current user has permission to modify board permissions
  const currentUserPermission = await projectsDb.findBoardPermission(
    boardId,
    currentUser.id
  );

  if (
    !currentUserPermission ||
    !canManagePermissions(currentUserPermission.permissionLevel)
  ) {
    throw new Error('You do not have permission to modify board permissions');
  }

  // Cannot change permission of board owner
  const board = await projectsDb.getBoardById(boardId);
  if (!board) throw new Error('Board not found');

  if (board.userId === targetUserId) {
    throw new Error('Cannot modify board owner permissions');
  }

  // Add or update user permission
  const existingPermission = await projectsDb.findBoardPermission(
    boardId,
    targetUserId
  );

  if (existingPermission) {
    await projectsDb.updateBoardPermission(
      boardId,
      targetUserId,
      permissionLevel
    );
  } else {
    await projectsDb.insertBoardPermission({
      boardId,
      userId: targetUserId,
      permissionLevel
    });
  }
}

export async function removeUserFromBoard(
  boardId: number,
  targetUserId: number,
  currentUser: User
): Promise<void> {
  // Check if current user has permission to modify board permissions
  const currentUserPermission = await projectsDb.findBoardPermission(
    boardId,
    currentUser.id
  );

  if (
    !currentUserPermission ||
    !canManagePermissions(currentUserPermission.permissionLevel)
  ) {
    throw new Error('You do not have permission to modify board permissions');
  }

  // Cannot remove board owner
  const board = await projectsDb.getBoardById(boardId);
  if (!board) throw new Error('Board not found');

  if (board.userId === targetUserId) {
    throw new Error('Cannot remove board owner');
  }

  await projectsDb.deleteBoardPermission(boardId, targetUserId);
}

// Helper function to check if a permission level can manage other permissions
function canManagePermissions(permissionLevel: BoardPermission): boolean {
  return ['owner', 'admin'].includes(permissionLevel);
}

// Helper function to check if a user can perform specific actions
export async function canUserAccessBoard(
  boardId: number,
  userId: number,
  requiredPermission: BoardPermission
): Promise<boolean> {
  const permission = await projectsDb.findBoardPermission(boardId, userId);
  if (!permission) return false;

  const permissionLevels: BoardPermission[] = [
    'owner',
    'admin',
    'editor',
    'viewer'
  ];
  const userPermissionIndex = permissionLevels.indexOf(
    permission.permissionLevel
  );
  const requiredPermissionIndex = permissionLevels.indexOf(requiredPermission);

  return userPermissionIndex <= requiredPermissionIndex;
}

// export async function getBoardById(boardId: number): Promise<Board | null> {
//   return await projectsDb.getBoardById(boardId);
// }

export async function getProjectById(projectId: number): Promise<Board | null> {
  return await projectsDb.getBoardById(projectId);
}

//determin if user is admin or guest
// export function isAdmin(user: User) {
//   return user.role === 'admin';
// }

// export function isGuest(user: User) {
//   return user.role === 'guest';
// }

export async function getListsByBoardId(
  boardId: number
): Promise<ListWithCards[]> {
  return await projectsDb.getListsByBoardId(boardId);
}

//take user id and board id and return the permission level
export async function getBoardPermission(
  userId: number,
  boardId: number
): Promise<BoardPermission | null> {
  return await projectsDb.getBoardPermission(userId, boardId);
}

export async function checkUserBoardAccess(
  boardId: number,
  userId: number
): Promise<boolean> {
  const permission = await projectsDb.findBoardPermission(boardId, userId);
  // Simply check if they have any permission record
  return permission !== null;
}

export async function createList(
  name: string,
  boardId: number,
  user: User
): Promise<List> {
  return await projectsDb.createList(name, boardId, user);
}

export async function updateList(
  listId: number,
  name: string,
  user: User
): Promise<List> {
  // Verify user has permission to update this list
  const list = await projectsDb.getListById(listId);
  if (!list) throw new Error('List not found');

  const permission = await projectsDb.findBoardPermission(
    list.boardId,
    user.id
  );
  if (!permission) throw new Error('Not authorized to update this list');

  return await projectsDb.updateList(listId, name);
}

export async function deleteList(listId: number, user: User): Promise<void> {
  // Verify user has permission to delete this list
  const list = await projectsDb.getListById(listId);
  if (!list) throw new Error('List not found');

  const permission = await projectsDb.findBoardPermission(
    list.boardId,
    user.id
  );
  if (!permission) throw new Error('Not authorized to delete this list');

  await projectsDb.deleteList(listId);
}

export async function copyList(listId: number, user: User): Promise<List> {
  // Verify user has permission to copy this list
  const list = await projectsDb.getListById(listId);
  if (!list) throw new Error('List not found');

  const permission = await projectsDb.findBoardPermission(
    list.boardId,
    user.id
  );
  if (!permission) throw new Error('Not authorized to copy this list');

  // Get all cards from the original list
  const cards = await projectsDb.getCardsByListId(listId);

  // Create a copy of the list with a new name
  const copiedList = await projectsDb.createList(
    `${list.name} (copy)`,
    list.boardId,
    user
  );

  // Copy all cards to the new list
  if (cards.length > 0) {
    await Promise.all(
      cards.map(async (card, index) => {
        await projectsDb.createCard({
          name: card.name,
          description: card.description,
          listId: copiedList.id,
          order: index,
          status: card.status,
          assignedTo: card.assignedTo
        });
      })
    );
  }

  return copiedList;
}

export async function createCard(
  params: {
    name: string;
    description?: string;
    listId: number;
  },
  user: User
): Promise<Card> {
  process.stdout.write(
    `\n[DEBUG] Use Case: createCard started ${JSON.stringify(
      { params, userId: user.id },
      null,
      2
    )}\n`
  );

  const list = await projectsDb.getListById(params.listId);
  if (!list) {
    process.stdout.write(
      `\n[ERROR] Use Case: List not found ${JSON.stringify(
        { listId: params.listId },
        null,
        2
      )}\n`
    );
    throw new Error('List not found');
  }

  // Verify user has permission to create cards in this list
  const permission = await projectsDb.findBoardPermission(
    list.boardId,
    user.id
  );
  if (!permission) {
    process.stdout.write(
      `\n[ERROR] Use Case: User not authorized ${JSON.stringify(
        {
          userId: user.id,
          listId: params.listId,
          boardId: list.boardId
        },
        null,
        2
      )}\n`
    );
    throw new Error('Not authorized to create cards in this list');
  }

  process.stdout.write(
    `\n[DEBUG] Use Case: Permission verified ${JSON.stringify(
      {
        permission,
        userId: user.id,
        listId: params.listId
      },
      null,
      2
    )}\n`
  );

  // Get max order for the list
  const cards = await projectsDb.getCardsByListId(params.listId);
  const maxOrder = cards.reduce((max, card) => Math.max(max, card.order), -1);

  process.stdout.write(
    `\n[DEBUG] Use Case: Creating card with params ${JSON.stringify(
      {
        name: params.name,
        description: params.description ?? null,
        listId: params.listId,
        order: maxOrder + 1,
        status: taskStatusEnum.enumValues[0]
      },
      null,
      2
    )}\n`
  );

  try {
    const card = await projectsDb.createCard({
      name: params.name,
      description: params.description ?? null,
      listId: params.listId,
      order: maxOrder + 1,
      status: taskStatusEnum.enumValues[0] as TaskStatus
    });

    process.stdout.write(
      `\n[DEBUG] Use Case: Card created successfully ${JSON.stringify(
        card,
        null,
        2
      )}\n`
    );
    return card;
  } catch (error) {
    process.stdout.write(
      `\n[ERROR] Use Case: Error creating card: ${
        error instanceof Error ? error.message : String(error)
      }\n`
    );
    throw error;
  }
}
