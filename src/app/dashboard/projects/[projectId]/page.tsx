import { notFound, redirect } from 'next/navigation';
import {
  getProjectById,
  getListsByBoardId,
  getBoardPermission,
  checkUserProjectAccess
} from '@/use-cases/projects';
import { Board, List, Card } from '@/db/schema';
import { Suspense } from 'react';
import { PublicError } from '@/use-cases/errors';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import { ListContainer } from '../_components/list-container';
import {
  canAccessSettings,
  canUseListForm,
  type Permission
} from '@/util/auth-projects';
import { ProjectIdProvider } from '../_components/project-id-provider';

interface PageProps {
  params: {
    projectId: string;
  };
}

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
async function getProject(projectId: string): Promise<Board> {
  try {
    const id = parseInt(projectId, 10);
    if (isNaN(id)) {
      throw new Error('Invalid project ID');
    }

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

type ListWithCards = List & {
  cards: Card[];
};

function ProjectDetails({
  project,
  user,
  lists,
  permission
}: {
  project: Board;
  user: any;
  lists: ListWithCards[];
  permission: Permission;
}) {
  // console.log('Permission object:', permission);
  // console.log('Permission type:', typeof permission);
  // console.log('Permission role:', permission?.role);
  // console.log('Can access settings:', canAccessSettings(permission));

  return (
    <div className="pt-8 space-y-6">
      <nav className="flex bg-indigo-900">
        <div className="flex justify-between items-center w-full p-3">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {canAccessSettings(permission) && (
            <Settings className="w-6 h-6 cursor-pointer" />
          )}
        </div>
      </nav>
      <div className="space-y-2 overflow-x-auto">
        <ListContainer
          boardId={project.id}
          data={lists}
          user={user}
          permission={permission}
          canUseListForm={canUseListForm(permission)}
        />
      </div>
    </div>
  );
}

export const revalidate = 3600;

export default function ProjectPage({ params }: PageProps) {
  return (
    <ProjectIdProvider projectId={Number(params.projectId)}>
      <Suspense fallback={<ProjectSkeleton />}>
        <AsyncProjectContent projectId={params.projectId} />
      </Suspense>
    </ProjectIdProvider>
  );
}

async function AsyncProjectContent({ projectId }: { projectId: string }) {
  const [project, user] = await Promise.all([
    getProject(projectId),
    getCurrentUserData()
  ]);

  // First check if user has basic access to this project
  const hasAccess = await checkUserProjectAccess(project.id, user.id);
  if (!hasAccess) {
    redirect('/sign-in'); // Redirect to sign-in if no access
  }

  // If they have access, get their specific permission level and lists
  const [lists, permission] = await Promise.all([
    getListsByBoardId(project.id),
    getUserBoardPermission(user.id, project.id)
  ]);

  // If for some reason we couldn't get their permission level, redirect to projects
  if (!permission.role) {
    redirect('/dashboard/projects');
  }

  return (
    <ProjectDetails
      project={project}
      user={user}
      lists={lists}
      permission={permission}
    />
  );
}

//user currently returns system role, we also need project permissions.
async function getCurrentUserData() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }
  return user;
}

//get user board permission.
async function getUserBoardPermission(
  userId: number,
  boardId: number
): Promise<Permission> {
  const permissionRole = await getBoardPermission(userId, boardId);
  // Convert the string role into a proper Permission object
  return {
    role: permissionRole as 'owner' | 'editor' | 'viewer',
    canEdit: permissionRole === 'owner' || permissionRole === 'editor'
  };
}
