import { notFound, redirect } from 'next/navigation';
import {
  getProjectById,
  getListsByBoardId,
  getBoardPermission,
  checkUserBoardAccess
} from '@/use-cases/projects';
import { Board } from '@/db/schema/projects';
import { User } from '@/db/schema/base';
import { Suspense } from 'react';
import { PublicError } from '@/use-cases/errors';
import { Skeleton } from '@/components/ui/skeleton';

import { getCurrentUser } from '@/lib/session';

import {
  canAccessSettings,
  canUseListForm,
  type Permission
} from '@/util/auth-projects';
import { BoardStoreInitializer } from '../_components/board-store-initializer';
import { ListWithCards } from '@/use-cases/types';
import CreateEditBoardButton from '../_components/create-edit-board-button';

import DeleteBoardButton from '../_components/delete-board-button';

import { BoardContentSwitcher } from '../_components/board-content-switcher';

import { BoardSettingsIcon } from '../_components/board-settings-icon';

interface PageProps {
  params: {
    boardId: string;
    user: User;
  };
}

//export const dynamic = 'force-dynamic';

// Loading component for the project details
function ProjectSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        {/* Title skeleton */}
        <Skeleton className="h-9 w-[200px]" />

        <div className="space-y-2">
          {/* Project ID skeleton */}
          <Skeleton className="h-5 w-[150px]" />
          {/* Description skeleton */}
          <Skeleton className="h-5 w-[300px]" />
        </div>
      </div>

      <div className="space-y-2">
        {/* Created date skeleton */}
        <Skeleton className="h-5 w-[180px]" />
        {/* Updated date skeleton */}
        <Skeleton className="h-5 w-[180px]" />
      </div>
    </div>
  );
}

// Separate data fetching logic
async function getProject(boardId: string): Promise<Board> {
  try {
    const id = parseInt(boardId, 10);
    if (isNaN(id)) {
      throw new Error('Invalid project ID');
    }
    //get all the data on the board from the board table in db.
    const project = await getProjectById(id);

    if (!project) {
      notFound();
    }

    return project;
  } catch (error) {
    if (error instanceof PublicError) {
      throw error;
    }
    console.error('Error fetching project:', error);
    throw new Error('Failed to load project');
  }
}

interface ProjectDetailsProps {
  board: Board;
  user: User;
  lists: ListWithCards[];
  permission: Permission;
}

function ProjectDetails({
  board,
  user,
  lists,
  permission
}: ProjectDetailsProps) {
  return (
    <div className="pt-8 space-y-6 ml-4">
      <nav className="flex bg-backgroundMuted rounded-lg max-w-5xl">
        <div className="flex justify-between items-center w-full p-2">
          <h1 className="text-3xl font-bold ">{board.name}</h1>
          <div className="flex items-center gap-6">
            <DeleteBoardButton boardId={board.id} />
            {canAccessSettings(permission) && (
              <CreateEditBoardButton
                boardId={board.id.toString()}
                boardName={board.name}
                boardDescription={board.description}
                clientId={board.clientId}
              />
            )}
            <BoardSettingsIcon />
          </div>
        </div>
      </nav>
      <div className="space-y-2 overflow-x-auto">
        <BoardContentSwitcher
          boardId={board.id}
          user={user}
          lists={lists}
          permission={permission}
          canUseListForm={canUseListForm(permission)}
        />
      </div>
    </div>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <AsyncProjectContent boardId={params.boardId} user={user} />
    </Suspense>
  );
}

async function AsyncProjectContent({
  boardId,
  user
}: {
  boardId: string;
  user: User;
}) {
  const board = await getProject(boardId);

  // First check if user has basic access to this project
  const hasAccess = await checkUserBoardAccess(board.id, user.id);
  if (!hasAccess) {
    redirect('/sign-in');
  }

  // If they have access, get their specific permission level and lists
  const [lists, permission] = await Promise.all([
    getListsByBoardId(board.id),
    getUserBoardPermission(user.id, board.id)
  ]);

  // If for some reason we couldn't get their permission level, redirect to projects
  //TODO: CHECK THIS IS SAFE. DODGY PERHAPS?
  if (!permission.role) {
    redirect('/dashboard/projects');
  }

  return (
    <>
      <BoardStoreInitializer boardId={board.id} />
      <ProjectDetails
        board={board}
        user={user}
        lists={lists}
        permission={permission}
      />
    </>
  );
}

//user currently returns system role, we also need project permissions.
//TODO: duplication of code. with the getCurrentUser function?? and it does not appear to be used anywhere.
async function getCurrentUserData() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }
  return user;
}
//TODO: CHECK THIS IS SAFE. DODGY PERHAPS?. IF WE CANT FIND PERMISSSIONS THEN SHOULD WE GO TO SIGN-IN AGAIN?
async function getUserBoardPermission(
  userId: number,
  boardId: number
): Promise<Permission> {
  const role = await getBoardPermission(userId, boardId);
  if (!role) {
    return { role: 'viewer' }; // Default to viewer if no permission is found
  }

  // Map database permissions to frontend permissions
  switch (role) {
    case 'owner':
      return { role: 'owner' };
    case 'admin':
    case 'editor':
      return { role: 'editor' };
    case 'viewer':
      return { role: 'viewer' };
    default:
      return { role: 'viewer' }; // Default case
  }
}
