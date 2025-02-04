import { redirect } from 'next/navigation';
import { database } from '@/db/drizzle';
import { boards, boardPermissions } from '@/db/schema';
import { eq } from 'drizzle-orm';
//import * as projectsDb from '@/data-access/projects';

interface Permission {
  role?: 'owner' | 'editor' | 'viewer';
  canEdit?: boolean;
}

export function canAccessSettings(permission: Permission): boolean {
  return permission?.role === 'owner';
}

export function canUseListForm(permission: Permission): boolean {
  return permission?.role === 'owner' || permission?.role === 'editor';
}

export function canEditContent(permission: Permission): boolean {
  return permission?.role === 'owner' || permission?.role === 'editor';
}

export function canDeleteContent(permission: Permission): boolean {
  return permission?.role === 'owner';
}

export function isAtLeastViewer(permission: Permission): boolean {
  return !!permission?.role;
}

export function isAtLeastEditor(permission: Permission): boolean {
  return permission?.role === 'owner' || permission?.role === 'editor';
}

export function isOwner(permission: Permission): boolean {
  return permission?.role === 'owner';
}

// Export the Permission type for use in other files
export type { Permission };

// This is a helper function to check if a user has permission to access a board and has the appropriate permission level of 'owner'

export async function checkBoardOwnership(
  boardId: number,
  userId: number,
  redirectPath: string = '/dashboard/projects'
): Promise<boolean> {
  try {
    // Get the board to check ownership
    const board = await database.query.boards.findFirst({
      where: eq(boards.id, boardId)
    });
    if (!board) {
      redirect(redirectPath);
      return false;
    }

    // Check if user is the original creator of the board
    if (board.userId !== userId) {
      redirect(redirectPath);
      return false;
    }

    // Get user's permission level for this board
    const permission = await database.query.boardPermissions.findFirst({
      where: eq(boardPermissions.boardId, boardId)
    });
    if (!permission || permission.permissionLevel !== 'owner') {
      redirect(redirectPath);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking board ownership:', error);
    redirect(redirectPath);
    return false;
  }
}
