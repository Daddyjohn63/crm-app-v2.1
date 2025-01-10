import { database } from '@/db/drizzle';
import type { Board, List, Card } from '@/db/schema/projects';
import type { User } from '@/db/schema/base';
import { BoardPermission } from '@/db/schema/enums';
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
